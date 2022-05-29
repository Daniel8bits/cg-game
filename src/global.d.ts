interface ICSS{
    [key: string]: any
}
declare module '*.css' {
    const data: ICSS;
    export default data;
}

declare module 'collada-dae-parser';