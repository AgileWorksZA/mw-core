# Service Connection Spec

## Feature
This is inspired by the `Service Connections` feature in Azure DevOps,
which allows us to connect to external services and configure them in a way that they can be used in our application.

Instead of defining a ServiceConnection from a JSON configuration file,
this allows us to create one in the IDE, which serves as a template for actual
`Connections` types. ServiceConnections take care of storing the URL, authentication,
and other configuration details, while the actual `Connections` are responsible
for consuming the data from the ServiceConnection and transforming it into a
data source that can be used in our application.

### Things to consider
We should probably formalize a JSON schema for the ServiceConnection, so that we can
import and export them easily to share between projects?

### Unlocks
Having this makes it easier to share a single connection to multiple consumers.
Example: We have an OpenAPI file that describes a REST API, we can create a ServiceConnection
that points to that API, and then have multiple DataSources that we can use inside a
Transform or DataGrid, or Form, etc.