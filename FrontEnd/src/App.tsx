import { useState, Suspense, lazy } from 'react';
import useWorkflow from './hooks/useWorkflow';
import type { MenuItem } from './types/menu';
import NavMenu from './components/NavMenu';
import { Plus, Home, Settings, FileText, Workflow as EditorIcon, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchSkeleton from './components/SearchSkeleton';
import type { Workflow } from './types';
import ErrorBoundary from './components/ErrorBoundary';

const EditorPane = lazy(() => import('./components/EditorPane'));

export default function App() {
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'creator' | 'editor'>('creator');
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const { workflows, loading, createWorkflow, executeWorkflow } = useWorkflow();

  const toggleDark = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };

  const menuItems: MenuItem[] = [
    { label: 'Home', href: '/', icon: Home },
    {
      label: 'Workflows',
      href: '/workflows',
      icon: FileText,
      children: [
        { label: 'Templates', href: '/templates' },
        { label: 'History', href: '/history' },
      ],
    },
    { label: 'Editor', href: '/editor', icon: EditorIcon },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const user = { name: 'Dev User', avatar: undefined };

  const create = async () => {
    if (!name.trim()) return;
    const wf = await createWorkflow(name.trim());
    if (wf) {
      setSelected(wf);
      setTab('editor');
      setName('');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors`}>
      <NavMenu items={menuItems} user={user} onSearch={setSearch} loading={loading} />
      
      <button
        onClick={toggleDark}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-600" />}
      </button>

      <Suspense fallback={<SearchSkeleton />}>
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto p-6 md:p-8">
          <ErrorBoundary fallback={<div className="text-red-600">Something went wrong.</div>}>
            {tab === 'creator' ? (
              <>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create Workflow</h2>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter workflow name..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    aria-label="Workflow name"
                  />
                  <button
                    onClick={create}
                    disabled={loading || !name.trim()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                  >
                    <Plus size={20} />
                    <span>Create & Edit</span>
                  </button>
                </div>

                {workflows.length > 0 && (
                  <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Workflows</h3>
                    <ul className="space-y-3">
                      {workflows
                        .filter((w) => w.name.toLowerCase().includes(search.toLowerCase()))
                        .map((w) => (
                          <li
                            key={w.id}
                            className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">{w.name}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => { setSelected(w); setTab('editor'); }}
                                className="text-blue-600 hover:underline text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => executeWorkflow(w.id, { sample: 'test' })}
                                disabled={loading}
                                className="flex items-center space-x-1 text-green-600 hover:underline text-sm font-medium disabled:opacity-50"
                              >
                                <Play size={14} />
                                <span>Run</span>
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              selected && (
                <Suspense fallback={<div className="text-center py-10">Loading editor...</div>}>
                  <EditorPane workflow={selected} onSave={setSelected} onTest={executeWorkflow} />
                </Suspense>
              )
            )}

            {tab === 'editor' && (
              <button
                onClick={() => setTab('creator')}
                className="mt-6 inline-flex items-center text-blue-600 hover:underline font-medium"
              >
                ← Back to Creator
              </button>
            )}
          </ErrorBoundary>
        </motion.main>
      </Suspense>
    </div>
  );
}