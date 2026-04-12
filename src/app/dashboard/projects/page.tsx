'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HardHat, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Project {
  id: string;
  name: string;
  type: 'Full Construction' | 'Site Supervision' | 'Consultancy';
  location: string;
  startDate: string;
  expectedHandover: string;
  currentPhase: string;
  progress: number;
  lastUpdate: string;
  team: TeamMember[];
  documents: Document[];
  photos: Photo[];
  messages: number;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface Document {
  name: string;
  type: string;
  date: string;
  url: string;
}

interface Photo {
  url: string;
  caption: string;
  date: string;
}

const phases = [
  { id: 'consultation', name: 'Consultation', description: 'Initial meeting & requirements' },
  { id: 'design', name: 'Design Finalization', description: 'Drawings & approvals' },
  { id: 'approvals', name: 'Approvals', description: 'County & regulatory permits' },
  { id: 'construction', name: 'Construction', description: 'Building & supervision' },
  { id: 'handover', name: 'Handover', description: 'Final inspection & keys' }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'photos'>('overview');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_updates(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }

        // Format projects with additional data
        const formattedProjects: Project[] = (data || []).map(project => {
          const latestUpdate = project.project_updates?.[0];
          
          return {
            id: project.id,
            name: project.name,
            type: project.type,
            location: project.location,
            startDate: project.start_date,
            expectedHandover: project.expected_handover,
            currentPhase: project.current_phase,
            progress: project.progress,
            lastUpdate: latestUpdate?.description || `Project is currently in ${project.current_phase} phase`,
            team: [
              { name: 'John Mwangi', role: 'Project Manager', avatar: '' },
              { name: 'Sarah Ochieng', role: 'Architect', avatar: '' }
            ],
            documents: [
              { name: 'Building Permit Application', type: 'PDF', date: '2026-04-01', url: '#' },
              { name: 'Structural Drawings', type: 'PDF', date: '2026-03-28', url: '#' },
            ],
            photos: [],
            messages: 0
          };
        });

        setProjects(formattedProjects);
        if (formattedProjects.length > 0) {
          setSelectedProject(formattedProjects[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to project changes
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('projects-page-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${user.id}` },
          () => fetchProjects()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtime();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [supabase]);

  const project = projects.find(p => p.id === selectedProject);

  const getCurrentPhaseIndex = () => {
    return phases.findIndex(p => p.name === project?.currentPhase);
  };

  const getPhaseStatus = (phaseIndex: number) => {
    const currentIndex = getCurrentPhaseIndex();
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-tefetra" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep">My Projects</h1>
          <p className="text-stone-600 mt-1">Track your construction and supervision projects</p>
        </div>
        <Link href="/dashboard/messages" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Start New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <HardHat className="w-16 h-16 text-tefetra mx-auto mb-4" />
          <h3 className="font-bold text-deep text-lg mb-2">No Active Projects</h3>
          <p className="text-stone-600 mb-4">Start your construction journey with Tefetra</p>
          <Link href="/dashboard/messages" className="btn-primary">
            Start a Project
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Project List */}
          <div className="space-y-4">
            <h2 className="font-semibold text-deep px-2">Your Projects</h2>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  selectedProject === p.id 
                    ? 'bg-deep text-white shadow-lg shadow-deep/20' 
                    : 'bg-white hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-semibold ${selectedProject === p.id ? 'text-white' : 'text-deep'}`}>
                      {p.name}
                    </p>
                    <p className={`text-sm mt-1 ${selectedProject === p.id ? 'text-white/80' : 'text-stone-500'}`}>
                      {p.type}
                    </p>
                  </div>
                  {p.messages > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedProject === p.id ? 'bg-white text-deep' : 'bg-tefetra text-white'
                    }`}>
                      {p.messages}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <div className={`h-1.5 rounded-full ${selectedProject === p.id ? 'bg-white/30' : 'bg-stone-200'}`}>
                    <div 
                      className={`h-full rounded-full ${selectedProject === p.id ? 'bg-white' : 'bg-tefetra'}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${selectedProject === p.id ? 'text-white/70' : 'text-stone-400'}`}>
                    {p.progress}% complete
                  </p>
                </div>
              </button>
            ))}

            {/* New Project CTA */}
            <Link 
              href="/dashboard/messages"
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-stone-300 hover:border-tefetra hover:bg-tefetra/5 transition-colors text-stone-500 hover:text-tefetra"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Start New Project</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {project && (
              <>
                {/* Project Header Card */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-deep">{project.name}</h2>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-tefetra/10 text-tefetra border border-tefetra/20">
                          {project.type}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-1 flex items-center gap-2">
                        <HardHat className="w-4 h-4" />
                        {project.location}
                      </p>
                    </div>
                    <Link 
                      href={`/dashboard/messages?project=${project.id}`}
                      className="btn-secondary text-sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Team
                    </Link>
                  </div>

                  {/* Progress Tracker - 5 Stages */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-deep">Project Progress</span>
                      <span className="text-sm font-bold text-tefetra">{project.progress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-3 bg-stone-200 rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-gradient-to-r from-deep via-tefetra to-sage rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    {/* Phase Indicators */}
                    <div className="relative">
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 hidden sm:block" />
                      
                      <div className="grid grid-cols-5 gap-2">
                        {phases.map((phase, idx) => {
                          const status = getPhaseStatus(idx);
                          const isCurrent = status === 'current';
                          const isCompleted = status === 'completed';
                          
                          return (
                            <div key={phase.id} className="flex flex-col items-center text-center">
                              <div className={`
                                relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                                transition-all duration-300 border-2
                                ${isCompleted 
                                  ? 'bg-sage border-sage text-white' 
                                  : isCurrent 
                                    ? 'bg-tefetra border-tefetra text-white shadow-lg shadow-tefetra/30 animate-pulse'
                                    : 'bg-white border-stone-300 text-stone-400'
                                }
                              `}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : isCurrent ? (
                                  <Circle className="w-5 h-5" />
                                ) : (
                                  <span className="text-xs font-bold">{idx + 1}</span>
                                )}
                              </div>
                              
                              <div className="mt-2 hidden sm:block">
                                <p className={`text-xs font-medium ${
                                  isCurrent ? 'text-tefetra' : isCompleted ? 'text-sage' : 'text-stone-400'
                                }`}>
                                  {phase.name === 'Design Finalization' ? 'Design...' : phase.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Current Status Alert */}
                  <div className="mt-6 p-4 bg-tefetra/5 rounded-xl border border-tefetra/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-tefetra rounded-lg flex-shrink-0">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-deep">Current Phase: {project.currentPhase}</p>
                        <p className="text-sm text-stone-600 mt-1">{project.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-stone-200">
                  {[
                    { id: 'overview', label: 'Overview', icon: HardHat },
                    { id: 'documents', label: 'Documents', icon: FileText },
                    { id: 'photos', label: 'Site Photos', icon: ImageIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id 
                          ? 'border-tefetra text-tefetra' 
                          : 'border-transparent text-stone-500 hover:text-deep'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="glass rounded-2xl p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Timeline */}
                      <div>
                        <h3 className="font-semibold text-deep mb-4">Project Timeline</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-stone-50 rounded-xl">
                            <p className="text-xs text-stone-500 uppercase tracking-wider">Start Date</p>
                            <p className="font-medium text-deep mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-sage" />
                              {new Date(project.startDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="p-4 bg-tefetra/5 rounded-xl border border-tefetra/20">
                            <p className="text-xs text-tefetra uppercase tracking-wider">Expected Handover</p>
                            <p className="font-medium text-deep mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-tefetra" />
                              {new Date(project.expectedHandover).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Team */}
                      <div>
                        <h3 className="font-semibold text-deep mb-4">Project Team</h3>
                        <div className="flex flex-wrap gap-3">
                          {project.team.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep to-sage flex items-center justify-center text-white font-bold">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-deep">{member.name}</p>
                                <p className="text-xs text-stone-500">{member.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div>
                      <h3 className="font-semibold text-deep mb-4">Project Documents</h3>
                      {project.documents.length === 0 ? (
                        <p className="text-stone-500 text-center py-8">No documents yet</p>
                      ) : (
                        <div className="space-y-2">
                          {project.documents.map((doc, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-tefetra/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                  <FileText className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-deep">{doc.name}</p>
                                  <p className="text-xs text-stone-500">{doc.type} • {new Date(doc.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-tefetra">
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'photos' && (
                    <div>
                      <h3 className="font-semibold text-deep mb-4">Site Progress Photos</h3>
                      {project.photos.length === 0 ? (
                        <div className="text-center py-8">
                          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                          <p className="text-stone-500">No photos uploaded yet</p>
                          <p className="text-sm text-stone-400 mt-1">Photos will appear here as the project progresses</p>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {project.photos.map((photo, idx) => (
                            <div key={idx} className="group relative aspect-video bg-stone-100 rounded-xl overflow-hidden">
                              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                <p className="text-white font-medium text-sm">{photo.caption}</p>
                                <p className="text-white/70 text-xs">{new Date(photo.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}