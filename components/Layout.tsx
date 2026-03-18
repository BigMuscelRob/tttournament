'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Trophy, BookOpen, Settings, LayoutDashboard } from 'lucide-react';
import './Layout.css';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: <Home size={24} /> },
    { label: 'Teilnehmer', href: '/players', icon: <Users size={24} /> },
    { label: 'Gruppen', href: '/groups', icon: <LayoutDashboard size={24} /> },
    { label: 'Turnierbaum', href: '/bracket', icon: <Trophy size={24} /> },
    { label: 'Regeln', href: '/rules', icon: <BookOpen size={24} /> },
    { label: 'Admin', href: '/admin', icon: <Settings size={24} /> },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="brand">Uni-TTC</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`bottom-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.icon}
            <span className="bottom-label text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
