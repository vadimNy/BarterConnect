import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import LandingPage from "@/pages/landing";
import { LoginPage, SignupPage } from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import CreateRequestPage from "@/pages/create-request";
import MyRequestsPage from "@/pages/my-requests";
import MatchesPage from "@/pages/matches";
import InterestsPage from "@/pages/interests";
import MessagesPage from "@/pages/messages";
import AccountPage from "@/pages/account";
import TermsPage from "@/pages/terms";
import PublicRequestPage from "@/pages/public-request";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/r/:publicId" component={PublicRequestPage} />
      <Route path="/app">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>
      <Route path="/requests/new">
        {() => <ProtectedRoute component={CreateRequestPage} />}
      </Route>
      <Route path="/requests">
        {() => <ProtectedRoute component={MyRequestsPage} />}
      </Route>
      <Route path="/matches">
        {() => <ProtectedRoute component={MatchesPage} />}
      </Route>
      <Route path="/interests">
        {() => <ProtectedRoute component={InterestsPage} />}
      </Route>
      <Route path="/messages">
        {() => <ProtectedRoute component={MessagesPage} />}
      </Route>
      <Route path="/account">
        {() => <ProtectedRoute component={AccountPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
