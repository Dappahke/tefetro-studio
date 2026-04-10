import { notFound } from "next/navigation";
import { adminClient } from "@/lib/supabase/admin";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = params;

  const { data: order, error } = await adminClient
    .from("orders")
    .select(`
      *,
      products (
        title,
        category,
        price
      )
    `)
    .eq("id", id)
    .single();

  if (error || !order) return notFound();

  const addons = order.addons || [];

  return (
    <div className="section">
      <div className="section-inner space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-deep">
              Order Details
            </h1>
            <p className="text-sm text-stone-500">
              Manage order, payment and delivery
            </p>
          </div>

          <span className={`px-3 py-1 text-xs rounded-full font-medium
            ${order.status === "completed"
              ? "bg-sage/20 text-sage"
              : "bg-tefetra/20 text-tefetra"
            }`}>
            {order.status}
          </span>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* PRODUCT */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-deep">
                Product
              </h2>

              <div className="space-y-2">
                <p className="font-medium">
                  {order.products?.title}
                </p>
                <p className="text-sm text-stone-500">
                  {order.products?.category}
                </p>
                <p className="text-tefetra font-semibold">
                  KES {order.products?.price}
                </p>
              </div>
            </div>

            {/* ADDONS */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-deep">
                Add-ons
              </h2>

              {addons.length > 0 ? (
                <div className="space-y-3">
                  {addons.map((addon: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between border-b pb-2 text-sm"
                    >
                      <span>{addon.name}</span>
                      <span className="text-tefetra">
                        KES {addon.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400">
                  No add-ons selected
                </p>
              )}
            </div>

            {/* DOWNLOAD */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-deep">
                Delivery
              </h2>

              {order.download_url ? (
                <a
                  href={order.download_url}
                  target="_blank"
                  className="btn-primary"
                >
                  Download Files
                </a>
              ) : (
                <p className="text-sm text-stone-400">
                  Files not yet uploaded
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* SUMMARY */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-deep">
                Summary
              </h2>

              <div className="text-sm space-y-2">
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {order.created_at}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-lg font-semibold text-tefetra">
                  KES {order.total}
                </p>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-deep">
                Payment
              </h2>

              <p className="text-sm">
                Ref: {order.payment_ref || "N/A"}
              </p>

              <p className="text-sm text-stone-500">
                Status: {order.status}
              </p>
            </div>

            {/* ACTIONS */}
            <form
              action={async () => {
                "use server";

                await adminClient
                  .from("orders")
                  .update({ status: "completed" })
                  .eq("id", id);
              }}
            >
              <button className="btn-secondary w-full">
                Mark as Completed
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}