import { createBrowserClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  try {
    const supabase = createBrowserClient();
    
    // Exchange the auth code for a session
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Code exchange error:", exchangeError.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    if (!sessionData.session) {
      console.error("No session returned");
      return NextResponse.redirect(`${origin}/login?error=no_session`);
    }

    const user = sessionData.session.user;
    console.log("User authenticated:", user.id, user.email);

    // Wait for trigger to run
    await new Promise(resolve => setTimeout(resolve, 800));

    // Try to get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError.message);
      
      // Try to create profile manually as fallback
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ 
          id: user.id, 
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          role: 'user',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
        });

      if (insertError) {
        console.error("Insert profile error:", insertError.message);
        // Still redirect to dashboard even if profile creation fails
        return NextResponse.redirect(`${origin}/dashboard`);
      }
      
      // New profile created, redirect as regular user
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    // Profile exists, check role
    const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
    const redirectTo = isAdmin ? "/admin" : "/dashboard";
    
    console.log("Redirecting to:", redirectTo, "Role:", profile?.role);
    return NextResponse.redirect(`${origin}${redirectTo}`);

  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(`${origin}/login?error=exception`);
  }
}