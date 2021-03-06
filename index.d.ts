/**
 * Mark a class as test suite and provide a custom name.
 * @param name The suite name.
 */
export declare function suite(name: string): ClassDecorator;
/**
 * Mark a class as test suite. Use the class name as suite name.
 * @param target The test class.
 */
export declare function suite<TFunction extends Function>(target: TFunction): TFunction | void;
/**
 * Mark a method as test and provide a custom name.
 * @param name The test name.
 */
export declare function test(name: string): PropertyDecorator;
/**
 * Mark a method as test. Use the method name as test name.
 */
export declare function test(target: Object, propertyKey: string | symbol): void;
/**
 * Set a test method execution time that is considered slow.
 * @param time The time in miliseconds.
 */
export declare function slow(time: number): PropertyDecorator & ClassDecorator;
/**
 * Set a test method or suite timeout time.
 * @param time The time in miliseconds.
 */
export declare function timeout(time: number): PropertyDecorator & ClassDecorator;
/**
 * Mart a test or suite as pending.
 *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
 *  - Used as `@test @pending method` is `it("name");`
 */
export declare function pending<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;
/**
 * Mark a test or suite as the only one to execute.
 *  - Used as `@suite @only class` is `describe.only("name", ...)`.
 *  - Used as `@test @only method` is `it.only("name", ...)`.
 */
export declare function only<TFunction extends Function>(target: Object, propertyKey?: string | symbol): void;
/**
 * Mark a test or suite to skip.
 *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
 *  - Used as `@test @skip method` is `it.skip("name")`.
 */
export declare function skip<TFunction extends Function>(target: Object | TFunction, propertyKey?: string | symbol): void;

/**
 * Describe block
 *  - Used as `describe('test something', () => { @suite class Test {} });
 */
export declare function describe(desc: string, cb: Function):any
