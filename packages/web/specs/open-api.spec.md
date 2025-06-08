# OpenAPI/Swagger adapter

## Feature
This file type allows us to open an OpenAPI/Swagger file either as a JSON or YAML file,
and expose the endpoints and schemas to other files and components.

You Open it via a URL, or upload a file, or paste the content directly.

It takes the content of the file and stores it locally in the public folder,
of which the path is exposed as an output variable called `openApiPath` as a resource.

So in a nutshell, we just make the swagger locally available for other components to use,
but it also allows use to inspect the OpenAPI file to view all the documentation.

### Question 1
Do we use an existing library to parse the OpenAPI file and view it in the UI
or build our own? Maybe Redoc or Swagger UI?

### Unlocks
Having this component, we can then create OpenAPI-Connectors, that allows us to 
create a server address we can then connect to and configure endpoints in another file 
type to configure and consume the data, that we can then transform into a data source
with it's own schema that can be consumed by components like the DataGrid etc or forms and
updates etc.