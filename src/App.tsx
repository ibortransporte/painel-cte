// mapbox
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
//
import { Router } from 'src/router';
import { FluxuLibProvider } from '@fluxu-labs/lib';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from 'src/utils/apollo';
import { AuthProvider } from './contexts/AuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <FluxuLibProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ApolloProvider>
    </FluxuLibProvider>
  );
}
