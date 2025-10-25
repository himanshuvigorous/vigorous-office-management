import React, { useState, useEffect } from 'react';
import { FaRocket, FaUsers, FaTasks, FaHandshake, FaChartLine, FaCog, FaSyncAlt, FaShieldAlt, FaExpand, FaMobileAlt, FaCloud, FaFacebookF, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp, FiCheck, FiX, FiMenu, FiXCircle } from 'react-icons/fi';
import { MdDashboard, MdAttachMoney, MdPeople, MdAssignment, MdSecurity } from 'react-icons/md';
import { RiCustomerService2Line } from 'react-icons/ri';
import styles from './langigPage.module.css';
import { useNavigate } from 'react-router-dom';

const EasyMyOffice = () => {
  const [activeTab, setActiveTab] = useState('hrms');

  const navigate = useNavigate()

  const features = [
    {
      id: 'hrms',
      icon: <MdPeople size={24} />,
      title: 'HR Management System',
      description: 'Complete HR solution from recruitment to retirement',
      details: [
        'Automated onboarding workflows',
        'Attendance & leave management',
        'Performance evaluation system',
        'Payroll processing',
        'Employee self-service portal',
        'Document management'
      ]
    },
    {
      id: 'tasks',
      icon: <MdAssignment size={24} />,
      title: 'Task Management',
      description: 'Streamline your team\'s workflow with intelligent task management',
      details: [
        'Kanban & Gantt chart views',
        'Automated task assignment',
        'Time tracking & reporting',
        'Project milestones',
        'Collaboration tools',
        'Integration with calendars'
      ]
    },
    {
      id: 'crm',
      icon: <RiCustomerService2Line size={24} />,
      title: 'Client Management',
      description: 'Build stronger client relationships with our CRM tools',
      details: [
        'Lead & opportunity tracking',
        'Client communication history',
        'Contract management',
        'Service ticket system',
        'Customer portal',
        'Sales pipeline visualization'
      ]
    },
    {
      id: 'finance',
      icon: <MdAttachMoney size={24} />,
      title: 'Finance Module',
      description: 'Complete financial control at your fingertips',
      details: [
        'Invoice & billing automation',
        'Expense tracking',
        'Financial reporting',
        'Tax calculation',
        'Budget management',
        'Multi-currency support'
      ]
    }
  ];

  const footerData = {
    company: [
      { label: "Business Name", value: "OFFICE NEXUS Private Limited" },
      { label: "Head Office", value: " 2nd Floor, 56/83, Ward 27, Rajat Path, Mansarovar Sector 5, Mansarovar, Jaipur, Rajasthan 302020" },
      { label: "E-Mail", value: "vieasyprivatelimited@gmail.com" },
      { label: "Phone", value: "+91 8233611000" },
    ],
    legal: [
      { label: "Contact Us", link: "/contact" },
      { label: "Privacy Policy", link: "/Privacy-Policy" },
      { label: "Terms & Conditions", link: "/Terms-Conditions" }]
  };

  return (
    <div className="easy-my-office">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center my-4">
        <h1 className="text-header text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4">
          Introducing Easy my office
        </h1>
        <p className="text-header text-base sm:text-lg md:text-xl lg:text-2xl font-nunito text-center">
          India's <span className="text-yellow-800">Best Office Management Platform</span>
        </p>

        <div className="w-full flex justify-center items-center mt-8">
          <img
            src="/images/appimage/hero-img.webp"
            alt="Brain Bucks UI Mockup"
            className="w-full max-w-[1400px] h-auto object-contain"
          />
        </div>

<div className="flex justify-center items-center mt-2 gap-2">
<a
          href="https://play.google.com/store/apps/details?id=com.vigorous.E_Office"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 mt-8 bg-yellow-800 text-white font-semibold text-lg sm:text-xl rounded-md shadow-lg transform transition-all duration-300 hover:bg-yellow-600"
        >
          Download App
          <img
            src="data:image/png;base64,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"
            alt="Google Play Store"
            className="ml-2 w-auto h-8"
          />
        </a>
        <a
          href="https://apps.apple.com/us/app/eoffice/id6746927641"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 mt-8 bg-black text-white font-semibold text-lg sm:text-xl rounded-md shadow-lg transform transition-all duration-300 hover:bg-gray-800"
        >
          Download on iOS
          <img
            src="/images/App_Store.webp"
            alt="App Store"
            className="ml-2 w-auto h-8"
          />
        </a>
</div>

      </div>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Your Entire Office. <span>One Dynamic Platform.</span></h1>
            <p className={styles.subtitle}>
              Streamline HR, tasks, clients, and finances with our all-in-one office management solution designed to grow with your business.
            </p>
            <div onClick={() => navigate('/contact')} className={styles.ctaButtons}>
              <div className={styles.primaryButton}>
                Contact us
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.dashboardPreview}>
              {/* Animated dashboard preview */}
              <div className={styles.dashboardTabs}>
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    className={`${styles.tab} ${activeTab === feature.id ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(feature.id)}
                  >
                    {feature.icon}
                    <span>{feature.title}</span>
                  </button>
                ))}
              </div>
              <div className={styles.dashboardContent}>
                <div className={styles.featureHighlight}>
                  <h3>{features.find(f => f.id === activeTab).title}</h3>
                  <p>{features.find(f => f.id === activeTab).description}</p>
                  <ul>
                    {features.find(f => f.id === activeTab).details.map((detail, i) => (
                      <li key={i}><FiCheck className={styles.checkIcon} /> {detail}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.dashboardVisual}>
                  <img src="/images/dashboard.webp" className='shadow-lg rounded' alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2>Why Choose <span>EasyMyOffice</span></h2>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FaSyncAlt size={32} />
              </div>
              <h3>Fully Dynamic</h3>
              <p>Adapts to your unique business processes with customizable workflows and modules</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FaCloud size={32} />
              </div>
              <h3>Cloud-Based</h3>
              <p>Access your office from anywhere, on any device with our secure cloud platform</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FaShieldAlt size={32} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption and regular audits to protect your sensitive data</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FaExpand size={32} />
              </div>
              <h3>Scalable</h3>
              <p>Grows with your business from startup to enterprise with no performance loss</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FaCog size={32} />
              </div>
              <h3>Easy Integration</h3>
              <p>Connects seamlessly with your existing tools through our API ecosystem</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FaMobileAlt size={32} />
              </div>
              <h3>Mobile Ready</h3>
              <p>Full-featured mobile apps for iOS and Android to manage on the go</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Ready to Transform Your Office Operations?</h2>
          <p>Join thousands of businesses that trust EasyMyOffice for their daily operations</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-4 py-10 sm:px-10">
        <div className="max-w-7xl mx-auto  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ">

          <section className="flex flex-col justify-between">
            <img src="/images/appimage/E-office logo 1.png" alt="Brain Bucks Logo" className="mb-4 w-32" />
            <div className="flex gap-4 mb-4">
              <span className=" cursor-pointer hover:text-white"> <FaFacebookF /></span>
              <span className=" cursor-pointer hover:text-white"> <FaLinkedin /></span>
              <span className=" cursor-pointer hover:text-white"><FaInstagram /></span>
              <span className=" cursor-pointer hover:text-white"><FaYoutube /></span>
            </div>

            {footerData.company.map((item, idx) => (
              <p key={idx} className="mb-1 text-sm">
                <strong>{item.label}:</strong> {item.value}
              </p>
            ))}
          </section>
          <section></section>
          <section></section>
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold ">Quick Links</h3>
            {footerData.legal.map((item, idx) => (
              <p key={idx} className="text-sm">
                <div onClick={() => { window.location.href = item.link }} className="cursor-pointer hover:text-white">{item.label}</div>
              </p>
            ))}
          </section>

        </div>
      </footer>
    </div>
  );
};

export default EasyMyOffice;