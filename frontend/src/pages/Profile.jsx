import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { User, Mail, Shield, Save, Edit2, X, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { success, error: showError } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', formData);
            updateUser(res.data.user);
            success('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('New passwords do not match');
            return;
        }

        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
        const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
        const hasNumbers = /\d/.test(passwordData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

        if (passwordData.newPassword.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            showError('Password does not meet requirements');
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            success('Password changed successfully!');
            setShowPasswordChange(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-academic-50 p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Profile Info Card */}
                <div className="bg-white rounded-lg border border-academic-200 p-6 animate-fadeInDown">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-academic-900">Profile</h1>
                            <p className="text-sm text-academic-500 mt-1">Manage your account information</p>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-sage-700 text-white rounded hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-md text-sm"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-academic-200 text-academic-700 rounded hover:bg-academic-300 transition-colors text-sm"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-academic-700 mb-2 flex items-center gap-2">
                                <User size={16} />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500 disabled:bg-academic-50 disabled:text-academic-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-academic-700 mb-2 flex items-center gap-2">
                                <Mail size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500 disabled:bg-academic-50 disabled:text-academic-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-academic-700 mb-2 flex items-center gap-2">
                                <Shield size={16} />
                                Role
                            </label>
                            <input
                                type="text"
                                value={user?.role || ''}
                                disabled
                                className="w-full px-3 py-2 border border-academic-300 rounded-md bg-academic-50 text-academic-600 capitalize"
                            />
                        </div>

                        {isEditing && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sage-700 text-white rounded hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Save size={16} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </form>
                </div>

                {/* Password Change Card */}
                <div className="bg-white rounded-lg border border-academic-200 p-6 animate-slideUp">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-serif font-bold text-academic-900">Change Password</h2>
                            <p className="text-xs text-academic-500 mt-1">Update your password to keep your account secure</p>
                        </div>
                        {!showPasswordChange && (
                            <button
                                onClick={() => setShowPasswordChange(true)}
                                className="text-sm text-sage-700 hover:text-sage-800 hover:underline"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {showPasswordChange && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 pr-10 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-academic-400 hover:text-academic-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 pr-10 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-academic-400 hover:text-academic-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="mt-2 text-xs space-y-1 text-academic-500">
                                    <p className={passwordData.newPassword.length >= 8 ? "text-green-600" : ""}>
                                        • At least 8 characters
                                    </p>
                                    <p className={/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                                        • At least one uppercase letter
                                    </p>
                                    <p className={/[a-z]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                                        • At least one lowercase letter
                                    </p>
                                    <p className={/\d/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                                        • At least one number
                                    </p>
                                    <p className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                                        • At least one special character
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-academic-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sage-500"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-sage-700 text-white rounded hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordChange(false);
                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    className="px-4 py-2 bg-academic-200 text-academic-700 rounded hover:bg-academic-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
