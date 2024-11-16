import React from 'react';
import { 
  Calendar, 
  CreditCard, 
  FileText, 
  PieChart,
  Brain,
  TrendingUp,
  MessageSquare,
  Target,
  Briefcase,
  GraduationCap,
  Award,
  Users
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'Clinic Management',
      description: 'Comprehensive tools for running your practice efficiently',
      items: [
        { icon: Calendar, text: 'Smart Appointment Scheduling' },
        { icon: FileText, text: 'Digital Patient Records' },
        { icon: CreditCard, text: 'Integrated Billing System' },
        { icon: PieChart, text: 'Detailed Analytics & Reports' }
      ]
    },
    {
      title: 'AI Solutions',
      description: 'Cutting-edge AI technology to optimize your practice',
      items: [
        { icon: Brain, text: 'Dynamic Pricing Engine' },
        { icon: TrendingUp, text: 'Predictive Analytics' },
        { icon: MessageSquare, text: 'Patient Feedback Analysis' },
        { icon: Target, text: 'Smart Marketing Tools' }
      ]
    },
    {
      title: 'Career Development',
      description: 'Resources to advance your professional journey',
      items: [
        { icon: Briefcase, text: 'Job Matching System' },
        { icon: Award, text: 'Qualification Testing' },
        { icon: GraduationCap, text: 'Continuous Learning' },
        { icon: Users, text: 'Professional Networking' }
      ]
    }
  ];

  return (
    <div className="py-24 bg-white" id="features">
      {features.map((section, idx) => (
        <div key={section.title} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${idx > 0 ? 'mt-32' : ''}`}>
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              {section.description}
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.text} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative p-6 bg-white ring-1 ring-gray-900/5 rounded-lg">
                      <div>
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">{item.text}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}