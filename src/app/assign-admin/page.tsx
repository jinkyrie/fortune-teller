"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AssignAdminPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const assignAdminRole = async () => {
    if (!user) return;
    
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/admin/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          role: 'admin'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success! ${data.message}`);
        // Refresh the page to update the user metadata
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen celestial-gradient flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
    </div>;
  }

  if (!user) {
    return <div className="min-h-screen celestial-gradient flex items-center justify-center">
      <Card className="glass-card p-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">Please Sign In</h1>
        <p className="text-[var(--muted)]">You need to be signed in to assign admin role.</p>
      </Card>
    </div>;
  }

  return (
    <div className="min-h-screen celestial-gradient flex items-center justify-center p-6">
      <Card className="glass-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">
          Assign Admin Role
        </h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-[var(--muted)] text-sm">User ID:</p>
            <p className="font-mono text-xs break-all">{user.id}</p>
          </div>
          
          <div>
            <p className="text-[var(--muted)] text-sm">Email:</p>
            <p className="font-mono text-sm">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          
          <div>
            <p className="text-[var(--muted)] text-sm">Current Role:</p>
            <p className="font-mono text-sm">
              {user.publicMetadata?.role || 'No role assigned'}
            </p>
          </div>
          
          <Button
            onClick={assignAdminRole}
            disabled={loading}
            className="btn-gold w-full"
          >
            {loading ? 'Assigning...' : 'Assign Admin Role'}
          </Button>
          
          {result && (
            <div className={`p-3 rounded-lg text-sm ${
              result.includes('✅') 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {result}
            </div>
          )}
          
          <div className="text-center">
            <a 
              href="/admin" 
              className="text-[var(--primary)] hover:underline text-sm"
            >
              Try Admin Panel →
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
