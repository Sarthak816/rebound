import { Link } from 'react-router-dom';
import { Brain, TrendingUp, Users, Target, Sparkles, BarChart3, Shield, Zap } from 'lucide-react';
import CountUp from '../components/CountUp';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-academic-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
                    <div className="text-center animate-fadeInDown">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-800 rounded-full text-sm font-medium mb-6">
                            <Sparkles size={16} />
                            <span>AI-Powered Academic Wellness Platform</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-academic-900 mb-6">
                            Bounce Back with
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-800">
                                REBOUND
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-academic-600 mb-8 max-w-3xl mx-auto">
                            Transform academic stress into success. AI-powered task management meets mental wellness for students who refuse to give up.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-sage-700 text-white rounded-lg font-medium text-lg hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-xl"
                            >
                                Start Your Journey
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white text-sage-700 border-2 border-sage-700 rounded-lg font-medium text-lg hover:bg-sage-50 transition-all hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-academic-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Free for students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>AI-powered insights</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative gradient orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-sage-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-academic-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16 animate-slideUp">
                        <h2 className="text-4xl font-serif font-bold text-academic-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-academic-600 max-w-2xl mx-auto">
                            Powerful features designed to help students manage workload, reduce stress, and achieve their academic goals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-xl border border-academic-200 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-sage-50">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <Brain className="text-sage-700" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-academic-900 mb-2">AI Task Breakdown</h3>
                            <p className="text-academic-600">
                                Overwhelmed by big projects? Our AI breaks them into manageable steps with realistic timelines.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-xl border border-academic-200 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-purple-50">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="text-purple-700" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-academic-900 mb-2">Stress Analytics</h3>
                            <p className="text-academic-600">
                                Track your mental wellness over time with beautiful visualizations and personalized insights.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-xl border border-academic-200 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-blue-50">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Target className="text-blue-700" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-academic-900 mb-2">Smart Prioritization</h3>
                            <p className="text-academic-600">
                                AI-powered task sorting by urgency, deadline, and grade impact. Always know what to work on next.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 rounded-xl border border-academic-200 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-orange-50">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="text-orange-700" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-academic-900 mb-2">Grade Simulator</h3>
                            <p className="text-academic-600">
                                See how different scores will impact your final grade. Make informed decisions about where to focus.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="p-6 rounded-xl border border-academic-200 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-green-50">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="text-green-700" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-academic-900 mb-2">Teacher Dashboard</h3>
                            <p className="text-academic-600">
                                Educators can monitor student wellness and identify those who need support before it's too late.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="p-6 rounded-xl border border-academic-200 hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-yellow-50">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="text-yellow-700" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-academic-900 mb-2">Gamification</h3>
                            <p className="text-academic-600">
                                Earn achievements, build streaks, and level up. Turn productivity into a rewarding experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-sage-700 to-sage-900 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="animate-fadeInDown">
                            <div className="text-5xl font-bold mb-2">
                                <CountUp end={85} suffix="%" />
                            </div>
                            <div className="text-sage-200">Reduction in Academic Stress</div>
                        </div>
                        <div className="animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
                            <div className="text-5xl font-bold mb-2">
                                <CountUp end={92} suffix="%" />
                            </div>
                            <div className="text-sage-200">Task Completion Rate</div>
                        </div>
                        <div className="animate-fadeInDown" style={{ animationDelay: '0.2s' }}>
                            <div className="text-5xl font-bold mb-2">
                                <CountUp end={4.8} suffix="/5" />
                            </div>
                            <div className="text-sage-200">Student Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="bg-gradient-to-br from-sage-50 to-academic-50 rounded-2xl p-12 border border-sage-200">
                        <Shield className="mx-auto text-sage-700 mb-4" size={48} />
                        <h2 className="text-4xl font-serif font-bold text-academic-900 mb-4">
                            Ready to Transform Your Academic Journey?
                        </h2>
                        <p className="text-xl text-academic-600 mb-8">
                            Join thousands of students who are bouncing back from academic stress with REBOUND.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-4 bg-sage-700 text-white rounded-lg font-medium text-lg hover:bg-sage-800 transition-all hover:scale-105 hover:shadow-xl"
                        >
                            Begin Your Journey
                        </Link>
                        <p className="text-sm text-academic-500 mt-4">
                            No credit card required • Free forever for students
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-academic-900 text-academic-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-sm">
                        Built by Team Couch Potato for AMUHacks 5.0
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
