// src/components/Auth.tsx

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../lib/supabase'; // Import your Supabase client
import { useToast } from '../hooks/use-toast'; // For notifications

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: isSignUp ? "Check your email for confirmation." : "Logged in successfully!",
        variant: "default"
      });
      // Supabase automatically handles session storage and re-authentication on refresh.
      // After successful login, Index.tsx (or App.tsx) will detect the user.
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Sign Up' : 'Log In'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account to access the dashboard.' : 'Enter your credentials to access the dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? 'Signing Up...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Log In')}
            </Button>
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full"
              type="button"
            >
              {isSignUp ? 'Already have an account? Log In' : 'No account? Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};