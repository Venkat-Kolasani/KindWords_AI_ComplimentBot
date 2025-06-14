import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { CreateMessagePage } from './pages/CreateMessagePage';

export interface MessageData {
  friendName: string;
  moodTheme: string;
  deliveryMethod: 'email' | 'sms';
  scheduleTime: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'create'>('landing');
  
  const navigateToCreate = () => setCurrentPage('create');
  const navigateToLanding = () => setCurrentPage('landing');

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' ? (
        <LandingPage onGetStarted={navigateToCreate} />
      ) : (
        <CreateMessagePage onBack={navigateToLanding} />
      )}
    </div>
  );
}

export default App