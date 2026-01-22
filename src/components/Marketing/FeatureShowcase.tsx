import React from 'react';
import { Laptop, GraduationCap, Brain, Shield, BarChart3, Users } from 'lucide-react';

const FEATURES = [
    {
        icon: <Laptop className="w-6 h-6" />,
        title: "Unified Learning Hub",
        description: "LMS, SIS, and Communication tools in one cohesive, beautiful interface."
    },
    {
        icon: <Brain className="w-6 h-6" />,
        title: "AI & Veo Integration",
        description: "Generate cinematic learning materials and predictive academic insights instantly."
    },
    {
        icon: <GraduationCap className="w-6 h-6" />,
        title: "Student Success Matrix",
        description: "Track academic trajectories with our proprietary Destiny Matrix technology."
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Enterprise Grade Security",
        description: "Role-based access control, audit logs, and secure data encryption."
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Financial Intelligence",
        description: "Manage tuition, payroll, and grants with real-time financial dashboards."
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Community First",
        description: "Integrated portals for Students, Teachers, Parents, and Administrators."
    }
];

const FeatureShowcase: React.FC = () => {
    return (
        <div className="bg-slate-50 py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need to Run a Modern School</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Replace your fragmented tech stack with one powerful, unified operating system designed for the next generation of education.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <div key={idx} className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureShowcase;
