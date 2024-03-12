export declare namespace MigrateTypes {
    type UrlContainer = {
        tag: 'ConnectionString';
        url: string;
    };
    type PathContainer = {
        tag: 'SchemaPath';
        path: string;
    };
    type SchemaContainer = {
        tag: 'SchemaString';
        schema: string;
    };
    type GetDatabaseVersionParams = {
        datasource: SchemaContainer | UrlContainer | PathContainer;
    } | undefined;
}
