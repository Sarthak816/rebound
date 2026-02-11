import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const data = await register(formData.name, formData.email, formData.password, formData.role);
            if (data.role === 'student') navigate('/student/dashboard');
            else if (data.role === 'teacher') navigate('/teacher/dashboard');
            else if (data.role === 'admin') navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setError('Server unreachable. Is the backend running?');
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-academic-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-academic-200 w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-2xl font-serif font-bold text-academic-900">Rebound</h1>
                    <p className="text-sm text-academic-500 mt-1">Personalized Academic Recovery Engine</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 pr-10 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-academic-400 hover:text-academic-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="mt-2 text-xs space-y-1 text-academic-500">
                            <p className={formData.password.length >= 8 ? "text-green-600" : ""}>
                                • At least 8 characters
                            </p>
                            <p className={/[A-Z]/.test(formData.password) ? "text-green-600" : ""}>
                                • At least one uppercase letter
                            </p>
                            <p className={/[a-z]/.test(formData.password) ? "text-green-600" : ""}>
                                • At least one lowercase letter
                            </p>
                            <p className={/\d/.test(formData.password) ? "text-green-600" : ""}>
                                • At least one number
                            </p>
                            <p className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-green-600" : ""}>
                                • At least one special character
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 pr-10 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-academic-400 hover:text-academic-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">I am a...</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-sage-700 text-white py-2 rounded-md hover:bg-sage-800 transition-colors flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-academic-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sage-700 hover:text-sage-800 font-medium">
                        Sign in
                    </Link>
                </div>

                <div className="mt-4 text-xs text-academic-400 text-center">
                    Demo Credentials:<br />
                    Student: student@rebound.edu / Password@123<br />
                    Teacher: teacher@rebound.edu / Password@123
                </div>
            </div>
        </div>
    );
};

export default Register;
