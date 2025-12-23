import mitt from 'mitt';
import { ErrorLink } from '@apollo/client/link/error';

// ----------------------------------------------------------------------

type Events = {
  apolloError: { error: ErrorLink.ErrorHandlerOptions };
};

// ----------------------------------------------------------------------

export const eventEmitter = mitt<Events>();
