import { Target, Eye, Heart, Award, Users, Building2 } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-20 bg-primary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">About StayIndia</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Bridging travelers with India's finest hospitality since 2020
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-primary-50 border border-primary-100">
              <Target className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To make discovering and booking India's best hotels simple, affordable, and delightful for every traveler. We believe every journey deserves exceptional hospitality, and we work tirelessly to connect guests with stays that create lasting memories.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-accent-50 border border-accent-100">
              <Eye className="w-10 h-10 text-accent-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become India's most trusted hotel booking platform, known for quality, transparency, and the warmth of Indian hospitality. We envision a future where every traveler can find their perfect stay with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Hotels', value: '500+', icon: Building2 },
              { label: 'Cities', value: '50+', icon: Users },
              { label: 'Happy Guests', value: '10,000+', icon: Heart },
              { label: 'Awards', value: '15+', icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Our Journey</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">The StayIndia Story</h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              StayIndia was born from a simple observation: finding quality hotels across India's diverse landscape was harder than it needed to be. Founded in 2020 by a team of passionate travelers and hospitality enthusiasts, we set out to change that.
            </p>
            <p>
              Starting with just 50 hotels in 5 cities, we've grown to partner with over 500 premium properties across 50+ Indian cities. From the royal palaces of Rajasthan to the serene backwaters of Kerala, from the bustling streets of Mumbai to the tranquil beaches of Goa - we bring India's best stays to your fingertips.
            </p>
            <p>
              What sets us apart is our commitment to quality. Every hotel on our platform is personally verified by our team. We don't just list rooms; we curate experiences. Our customer support team is available 24/7, because we know travel plans don't always go smoothly, and that's when you need us most.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Our Values</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">What We Stand For</h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Guest-First', desc: 'Every decision we make starts with one question: does this improve the guest experience? From seamless booking to 24/7 support, your satisfaction drives us.' },
              { icon: Award, title: 'Quality Without Compromise', desc: 'We personally verify every property on our platform. No surprises, no disappointments - only stays that meet our high standards of excellence.' },
              { icon: Users, title: 'Celebrating Indian Hospitality', desc: 'India\'s hospitality tradition is world-renowned. We celebrate and amplify this heritage, connecting travelers with authentic, memorable experiences.' },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-accent-400 text-sm font-semibold tracking-wide uppercase">Our Team</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Meet the People Behind StayIndia</h2>
            <div className="w-16 h-1 bg-accent-400 rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sri Madhurya Vinjamuri', role: 'Founder & CEO', initial: 'V' },
              { name: 'Ananya Iyer', role: 'Head of Operations', initial: 'A' },
              { name: 'Satya Vinjamuri', role: 'Head of Technology', initial: 'R' },
            ].map((member) => (
              <div key={member.name} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {member.initial}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
