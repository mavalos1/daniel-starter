import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/features/auth/hooks/useAuth";

const AppProvider: React.FC = ({ children }) => (
  <Suspense fallback={<></>}>
    <ErrorBoundary fallback={<></>}>
      <AuthProvider>
        <Router>{children}</Router>
      </AuthProvider>
    </ErrorBoundary>
  </Suspense>
);

export default AppProvider;
