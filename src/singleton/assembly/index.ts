import { storage, Context } from "near-sdk-core"

@nearBindgen
export class Contract {
  private message: string = 'hello world'

  // return the string 'hello world'
  helloWorld(): string {
    return this.message
  }

  // read the given key from account (contract) storage
  read(key: string, account:string): string {
    const _key = `${account}_${key}`;
    if (storage.hasKey(_key)) {
      return `✅ Key [ ${_key} ] has value [ ${storage.getString(_key)!} ]`
    } else {
      return `🚫 Key [ ${_key} ] not found in storage. ( ${this.storageReport()} )`
    }
  }

  myKeys(account:string): string[] {
    const keys = storage.get(account, new Set<string>() );
    return keys ? keys.values() : [];
  }

  // write the given value at the given key to account (contract) storage
  @mutateState()
  write(key: string, value: string): string {
    let keys = storage.get(Context.sender, new Set<string>() );
    if(!keys) keys = new Set<string>();
    keys.add(`${Context.sender}_${key}`);
    storage.set(Context.sender, keys); // add set of user's key to storage

    storage.set(`${Context.sender}_${key}`, value);

    return `✅ Data saved from ${Context.sender}. ( ${this.storageReport()} )`
  }

  // private helper method used by read() and write() above
  private storageReport(): string {
    return `storage [ ${Context.storageUsage} bytes ]`
  }
}