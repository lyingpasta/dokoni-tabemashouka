### Code Organization

Inspired by a domain driven approach, the code splitted in different directories as:

- `app/`: contains the entrypoint of the app. The home page and global.css file. It also contains the values of the different Context providing them to the tree of components it renders.
- `domain/`: contains the entities and types of the objects used by the core.
- `hooks/`: contains the custom hooks to abstract the usages of context by providing ready to use functions.
- `server/`: contains the exclusive part of the app that runs exclusively on the server, talking about api calls, rate limiting
- `components/`: contains the react components that makes up the app

### Philosophy

The philosophy behind this organization is maintining a clean code, with an obvious separation of concerns. This translates in key fundamental rules I tried to follow designing these modules:

- Concentrate context initialization and declaration in one place (here is the root)
- Limit the number of components using a context to prevent useless renders
- Prioritize the usage of pure functions for rendering and use state only when needed to prevent unwanted rerenders specially in nested components
- One component one responsability
- Use typings to prevent incoherent behaviours
