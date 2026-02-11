import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, students: 0, teachers: 0, highRisk: 0 });
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });

    useEffect(() => {
        fetchData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            console.log('🔄 Auto-refreshing admin data...');
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all users from admin endpoint
            const res = await api.get('/admin/users');
            const allUsers = res.data || [];

            setUsers(allUsers);

            // Calculate stats from real data
            const students = allUsers.filter(u => u.role === 'student');
            const teachers = allUsers.filter(u => u.role === 'teacher');

            // For high risk, we'd need to fetch student data with risk levels
            // For now, estimate based on available data
            setStats({
                totalUsers: allUsers.length,
                students: students.length,
                teachers: teachers.length,
                highRisk: 0 // Will be updated when we fetch student risk data
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // In a real app, call the API to create user
            // await api.post('/admin/users', newUserData);

            // For demo, just add to local state
            const newUser = {
                _id: Date.now().toString(),
                ...newUserData
            };
            setUsers([...users, newUser]);
            setStats(prev => ({
                ...prev,
                totalUsers: prev.totalUsers + 1,
                students: newUserData.role === 'student' ? prev.students + 1 : prev.students,
                teachers: newUserData.role === 'teacher' ? prev.teachers + 1 : prev.teachers
            }));

            // Reset form and close modal
            setNewUserData({ name: '', email: '', password: '', role: 'student' });
            setShowAddUserModal(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-academic-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-academic-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-serif font-bold text-academic-900">Rebound Admin</h1>
                        <p className="text-xs text-academic-500">System Management</p>
                    </div>
                    <button onClick={logout} className="text-sm text-academic-500 hover:text-red-600">Logout</button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-academic-200 hover:shadow-md transition-all hover:scale-105 animate-fadeInDown">
                        <div className="flex items-center gap-3">
                            <Users className="text-sage-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-academic-900">{stats.totalUsers}</p>
                                <p className="text-xs text-academic-500">Total Users</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-academic-200 hover:shadow-md transition-all hover:scale-105 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="text-sage-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-academic-900">{stats.students}</p>
                                <p className="text-xs text-academic-500">Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-academic-200 hover:shadow-md transition-all hover:scale-105 animate-fadeInDown" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-3">
                            <Users className="text-sage-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-academic-900">{stats.teachers}</p>
                                <p className="text-xs text-academic-500">Teachers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-academic-200 hover:shadow-md transition-all hover:scale-105 animate-fadeInDown" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-amber-600" size={24} />
                            <div>
                                <p className="text-2xl font-bold text-academic-900">{stats.highRisk}</p>
                                <p className="text-xs text-academic-500">High Risk</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <section className="bg-white rounded-lg border border-academic-200 p-6 animate-slideUp">
                    <h2 className="text-lg font-serif font-bold text-academic-800 mb-4">User Management</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-academic-50 border-b border-academic-200">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-academic-700">Name</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-academic-700">Email</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-academic-700">Role</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-academic-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b border-academic-100">
                                        <td className="px-4 py-3 text-sm text-academic-900">{u.name}</td>
                                        <td className="px-4 py-3 text-sm text-academic-600">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded ${u.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                u.role === 'teacher' ? 'bg-sage-100 text-sage-700' :
                                                    'bg-academic-100 text-academic-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-xs text-sage-600 hover:text-sage-800 hover:underline transition-colors mr-3">Edit</button>
                                            <button className="text-xs text-red-600 hover:text-red-800 hover:underline transition-colors">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => setShowAddUserModal(true)}
                            className="px-4 py-2 bg-sage-700 text-white rounded text-sm hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-md"
                        >
                            Add New User
                        </button>
                    </div>
                </section>

                {/* System Health */}
                <section className="bg-white rounded-lg border border-academic-200 p-6">
                    <h2 className="text-lg font-serif font-bold text-academic-800 mb-4">System Health</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-academic-600">Database Status</span>
                            <span className="text-sm font-medium text-green-600">Healthy</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-academic-600">API Response Time</span>
                            <span className="text-sm font-medium text-green-600">45ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-academic-600">Active Sessions</span>
                            <span className="text-sm font-medium text-academic-900">12</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-slideUp">
                        <h2 className="text-xl font-serif font-bold text-academic-900 mb-4">Add New User</h2>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newUserData.name}
                                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newUserData.email}
                                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newUserData.password}
                                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                    required
                                    minLength={6}
                                />
                                <p className="text-xs text-academic-500 mt-1">Minimum 6 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">Role</label>
                                <select
                                    value={newUserData.role}
                                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-sage-700 text-white rounded hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-md"
                                >
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddUserModal(false);
                                        setNewUserData({ name: '', email: '', password: '', role: 'student' });
                                    }}
                                    className="px-4 py-2 bg-academic-200 text-academic-700 rounded hover:bg-academic-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
