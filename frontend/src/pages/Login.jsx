import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await login(email, password);
            if (data.role === 'student') navigate('/student/dashboard');
            else if (data.role === 'teacher') navigate('/teacher/dashboard');
            else if (data.role === 'admin') navigate('/admin/dashboard');
            else navigate('/login');
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setError('Server unreachable. Is the backend running?');
            } else if (err.response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError(`Login failed: ${err.response.data.message || err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-academic-50">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-academic-200 w-full max-w-md">
                <h1 className="text-2xl font-serif text-academic-900 mb-2">Rebound</h1>
                <p className="text-academic-500 mb-6 text-sm">Personalized Academic Recovery Engine</p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-academic-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-academic-300 rounded focus:outline-none focus:ring-1 focus:ring-sage-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sage-700 hover:bg-sage-800 text-white py-2 rounded transition-all hover:scale-105 hover:shadow-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-4 text-center text-xs text-academic-400">
                    <p>Demo Credentials:</p>
                    <p>Student: student@rebound.edu / password123</p>
                    <p>Teacher: teacher@rebound.edu / password123</p>
                </div>

                <div className="mt-4 text-center text-sm text-academic-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-sage-700 hover:text-sage-800 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
