# IDB class

A simple implementation of IndexedDB api.

## Getting started

```js
import {IdbClass} from "idb-class"

const idb = new IdbClass();
```

See the [demo](./demo) file

## Implemented Methods

- addData<T>(data: T, key?: IDBValidKey): void 
- updateData<T>(data: T, key: IDBValidKey): void 
- close() 
- deleteData(key: IDBValidKey | IDBKeyRange): void 
- deletaDatabase() 

## TODO

- implement [IDBObjectStore methods](https://developer.mozilla.org/fr/docs/Web/API/IDBObjectStore)


## Developement

```sh
$ make test # run a containerized playwright docker.
```

## LICENSE

Copyright 2023 Sébastien Gordano

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
