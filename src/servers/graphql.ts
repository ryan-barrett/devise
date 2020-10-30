import graphqlHTTP       from 'express-graphql';
import { graphqlConfig } from '../typing/interfaces';
import { Server }        from './server';
import { app }           from '../index';
import { logger }        from '../utils/logger';

export class GraphqlServer extends Server {
  private graphql: graphqlConfig;

  constructor(protected readonly port: string, graphql: graphqlConfig, middleware: Array<Function> = []) {
    super(port, middleware);
    this.graphql = graphql;
    this.app.use(GraphqlServer.ValidateJwtMiddleware);
    this.app.use('/graphql', graphqlHTTP((req) => {
      graphql.context = req;
      return graphql;
    }));
  }

  private static async ValidateJwtMiddleware(request: any, response: any) {
    logger.debug('hitting jwt middleware');
    const jwt = request.headers.authorization;
    const user = await app.callService('AuthenticationService', 'parseJwt', [jwt]);
    if (!user.id) {
      return response.status(401).send({ message: 'unauthorized' });
    }

    logger.debug({ user });
    request.user = user;
    request.next();
  }
}
