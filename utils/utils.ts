/**
 * The builting JS typeof operator returns one of "undefined",
 * "boolean", "number", "bigint", "string", "symbol", "function", or
 * "object".
 *
 * Arrays and null are both returned as "object", which in common use
 * cases (like processing JSON) requires awkward special casing.
 *
 * typeof_extended returns the same values as stock typeof, except
 * arrays are reported as 'array' and nulls are reported as 'null'.
 *
 * Typeof Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 */
type TypeofExtendedEnum =
    "undefined" | "boolean" | "number" | "bigint" | "string" | "symbol" |
    "function" | "object" | "null" | "array";

export function typeof_extended(v: any): TypeofExtendedEnum {
    const t = typeof v;
    if (t !== "object")
        return t;
    if (v === null)
        return "null";
    if (Array.isArray(v))
        return "array";
    return "object";
}

// /**
//  * Arrow functions are the only functions that have a 'undefined' prototype, so
//  * this is how we distinguish them from types.
//  */
// export function isArrowFunction (v: any): v is Function {
//     return typeof v == 'function' && v.prototype === undefined;
// };

// /**
//  * Determines whether obj has the named own property.
//  *
//  * 'obj.hasOwnProperty (propName)' is not, in general, correct,
//  * because the obj or any of its prototypes can define an override for
//  * hasOwnProperty.
//  *
//  * 'Object.prototype.hasOwnProperty.call (obj, propName)' - the
//  * usual workaround - is ugly - thus this wrapper function.
//  *
//  * Sadly, we can't call this 'hasOwnProperty' - or we are overriding
//  * 'hasOwnProperty' on the exports object - which could cause random
//  * screwyness + makes flow mad.
//  */
// export function hasOwnProp (obj: Object, propName: string|Symbol) {
//     return Object.prototype.hasOwnProperty.call (obj, propName);
// };


// // Returns class name for objects, or undefined it it cannot find a class name.
// // Uses non-standard Function.name property, so will not always work, but can be used
// // to make debugging dumps nicer in those environments where it does work.
// export function typeName (v:any): string {
//     var typeStr = typeof (v);
//     switch (typeStr) {
//         case 'function':
//             return (v as Function).name;
//         case 'object':
//             if (v === null)
//                 return 'null';
//             var proto = Object.getPrototypeOf (v)||v['__proto__'];
//             if (!proto)
//                 return 'object';
//             var construct = proto['constructor'];
//             if (!construct)
//                 return 'object';
//             return construct.name;
//         case 'undefined':
//             return 'undefined';
//         default:
//             return typeStr;
//     }
// }

// export function stringCompare (a:string, b:string) {
//     if (a < b)
//         return -1;
//     else if (a > b)
//         return 1;
//     else
//         return 0;
// }

// /**
//  * A typescript typesystem hack to allow for exhaustiveness checking of
//  * switch statements against a discriminated union.
//  *
//  * See: http://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
//  */
// export function assertNever (x: never): never {
//   throw new Error ('Unexpected object: ' + x);
// }

// /**
//  *
//  */
// export function assert(condition: any, msg?: string): asserts condition {
//   if (!condition)
//     throw new /*Assertion*/Error(msg ? ('assertion failed: '+msg) : ('assertion failed'))
// }

/**
 * A decorator that, when applied to a getter, caches the getter result until
 * the (global) invalidateCache is called.
 */
// export function lazy<T> (target: Object, key: string, descriptor: TypedPropertyDescriptor<T>) :TypedPropertyDescriptor<T> {

//   const memoizedResults = new WeakMap<Object, T>();
  
//   // --- Memoizing getter that wraps original getter.
//   function cachingGetter () {
//       let self:T = this as T;
//       // --- If we have cached this property computation, return it from the cache,
//       //     otherwise compute it and cache it.
//       //     A slightly odd factoring so that we only have to do the .get() when
//       //     cached result is present as long as the result is not 'undefined'.
//       let cachedValue = memoizedResults.get(self);
//       if(cachedValue === undefined && !memoizedResults.has(self)) {
//           let value = descriptor.get.call (self);
//           memoizedResults.set(self, value);
//           return value;
//       } else {
//           return cachedValue;
//       }
//   }

//   // --- Return descriptor that uses cachingGetter rather than original getter
//   return {get: cachingGetter, enumerable: false, configurable: true};
// }

/**
 * Partitions an array by key as defined by a supplied keyfn.
 *
 * The order of the items in the source array is preserved per
 * partition.
 */
export function partition_by<K,V>(items: V[], keyfn: (i:V)=>K): Map<K,V[]> {
    const partitions = new Map<K,V[]>();
    for(const item of items) {
        const key = keyfn(item);
        const existing_partition = partitions.get(key);
        if(existing_partition) {
            existing_partition.push(item);
        } else {
            partitions.set(key, [item]);
        }
    }
    return partitions;
}

/**
 * Partitions an array by key as defined by a supplied keyfn.
 *
 * The keyfn can return multiple keys per item.  Duplicate keys
 * returned by the keyfn are removed.
 *
 * The order of the items in the source array is preserved per
 * partition.
 */
export function multi_partition_by<K,V>(items: V[], keyfn: (i:V)=>K[]): Map<K,V[]> {
    const partitions = new Map<K,V[]>();
    for(const item of items) {
        const keys = [...new Set(keyfn(item))];
        for(const key of keys) {
            const existing_partition = partitions.get(key);
            if(existing_partition) {
                existing_partition.push(item);
            } else {
                partitions.set(key, [item]);
            }
        }
    }
    return partitions;
}
