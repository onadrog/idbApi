/**
 * @license
 * Copyright 2023 Sébastien Gordano
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * IdbApi `indexedDB` api implementation
 * @property {string} [dbName] - the indexedDB table name.
 * @property {number} [ver] - version of the indexedDb
 * @property {string} dbStoreName - Name for the store
 * @property {IDBObjectStoreParameters} dbStoreOptions - Store params
 *
 * For more infos visit the [IndexedDB doc](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
 *
 * @author Sébastien Gordano <sebastien.gordano@gmail.com>
 */
export class IdbApi {
	dbName: string;
	#dbReq?: IDBOpenDBRequest;
	ver: number;
	#db?: IDBDatabase;
	dbStoreName: string;
	dbStoreOptions: IDBObjectStoreParameters;

	constructor(
		dbName = "IdbApi",
		ver = 1,
		dbStoreName = "Idb",
		dbStoreOptions: IDBObjectStoreParameters = {
			keyPath: "id",
			autoIncrement: true,
		},
	) {
		this.dbName = dbName;
		this.ver = ver;
		this.dbStoreOptions = dbStoreOptions;
		this.dbStoreName = dbStoreName;
		this.#dbReq = this.#db = undefined;
		this.#init();
	}

	#init() {
		this.#dbReq = window.indexedDB.open(this.dbName, this.ver);
		this.#dbReq.onerror = (_) => {
			throw new Error(`Error: could not load database ${this.dbName}`);
		};
		this.#dbReq.onsuccess = ({ target }) => {
			this.#db = (target as IDBOpenDBRequest).result;
		};
		this.#dbReq.onupgradeneeded = ({ target }) => {
			this.#db = (target as IDBOpenDBRequest).result;
			this.#db.createObjectStore(this.dbStoreName, this.dbStoreOptions);
		};
	}

	/**
	 * @param {IDBValidKey} key - The key to retrieve the data.
	 * Return a Promise of data based on the provided key;
	 * @returns {Promise<T>}
	 */
	async getData<T>(key: IDBValidKey): Promise<T> {
		if (undefined === this.#db) {
			throw new Error(`"${this.dbName}" must be initilized first`);
		}
		const store = this.#getObjectStore("readonly");
		const storeData = store.get(key);

		storeData.onerror = (_) => {
			throw new Error(`Could not get data for key ${key}`);
		};
		try {
			return await this.#getPromise<T>(storeData);
		} catch (e) {
			console.error(e);
			throw new Error(`Could not get data for key "${key}"`);
		}
	}

	#getPromise<T>(request: IDBRequest): Promise<T> {
		return new Promise((resolve, reject) => {
			request.onsuccess = ({ target }) =>
				resolve((target as IDBRequest).result);
			request.onerror = () => reject(request.error);
		});
	}

	#getObjectStore(mode: IDBTransactionMode): IDBObjectStore {
		if (undefined === this.#db) {
			throw new Error(`"${this.dbName}" must be initilized first`);
		}
		const transaction = this.#db.transaction(this.dbStoreName, mode);
		transaction.onerror = (_) => {
			throw new Error(`Could not initialize transaction for ${this.dbName}`);
		};
		return transaction.objectStore(this.dbStoreName);
	}

	/**
	 * @param {T} data - The data to add in the table
	 * @param {IDBValidKey} [key] - the key for the data
	 *
	 * Add a new entry into the table.
	 */
	addData<T>(data: T, key?: IDBValidKey): void {
		const store = this.#getObjectStore("readwrite");
		const newData = store.put(data, key);
		newData.onerror = (_) => {
			throw new Error(`Could not update data for "${key}"`);
		};
	}

	/**
     * @param {oldata} cb - callback used to update the data.
     * @param {IDBValidKey} key - The key to retrieve data.
    
    Update the `ObjectStore` with the new given data
     */
	updateData<T>(cb: (oldData: T) => T, key: IDBValidKey): void {
		const store = this.#getObjectStore("readwrite");
		const storeData = store.get(key);
		storeData.onerror = (_) => {
			throw new Error(
				`Could not update data for "${key}", key does not exist.`,
			);
		};

		storeData.onsuccess = () => {
			const data = storeData.result;
			const newData = cb(data);
			console.log(newData, data);
			store.put(newData);
		};
	}

	/**
	 * Close the database connection.
	 */
	close() {
		if (undefined === this.#db) {
			this.#dbReq = this.#db;
			return;
		}
		this.#db.close();
		this.#db = this.#dbReq = undefined;
	}

	/**
	 * Remove data from database based on the key.
	 */
	deleteData(key: IDBValidKey | IDBKeyRange): void {
		const store = this.#getObjectStore("readwrite");
		store.delete(key);
	}

	/**
	 * Delete the Database.
	 */
	deletaDatabase() {
		if (!this.#db || this.#dbReq) {
			this.#db = this.#dbReq = undefined;
			return;
		}

		this.#db.deleteObjectStore(this.dbStoreName);
	}
}
