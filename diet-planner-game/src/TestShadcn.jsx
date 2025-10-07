import React from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';

export function TestShadcn() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-8">shadcn/ui Test</h1>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Button Test</CardTitle>
            <CardDescription>Testing shadcn/ui buttons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badge Test</CardTitle>
            <CardDescription>Testing shadcn/ui badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
