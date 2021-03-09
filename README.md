# **fs-db**
### **Using your very own filesystem as a database: a little project of mine**

This package allows for the use of your very own filesystem as a fully mutable database. The main concept behind this project is for speed, and the ability for data to be ebla eto be read and interpreted by humans. 

Although, it is important that you note one tiny detail: **YOU SHOULD NOT USE THIS AS A DATABASE FOR MUCH LARGER PROJECTS.** In relation to VPS hosting, many servers count reading from/writing to files a "labour-intensive" action, thus meaning they may charge you more for it. 

If you are looking to use a database for a considerably larger project (i.e. store a lot of more amounts of data), then I suggest you try [keyv](https://github.com/lukechilds/keyv), or any other database alternative.

However, if you are looking for to use this for a tiny projects of yours (say, a test bot or a private bot), then I recommend that you read on:

### **How it Works**
This little project works by setting a text file with the name as its key, and its contents then become its value. For exmaple, by calling `Database.set("abc", 123)` a new file called `abc` will be created, and it will have contents of `"123"`.

## **__Documentation__**
### class Database 
`Database(path<String>);` // path on which all data entries will be held. 

### **Method get(key: string, options: object)**
Gets the value of a key from the database with optional data type to return it as.
#### **options.precisePath**
any subfolder of this.path which should be looked in (default: "")
#### **options.dataType**
dataType (type of data which is to be returned) can take one of [bigint, number, date, str, json] [default: "str"]
#### **options.encoding**
encoding to be parsed into fs function [default: "utf8"]
#### **options.flag**
flag to be parsed into fs function to read file [default: "r"]

All examples will be shown at the bottom of this document.

### **Method set(key: string, value: string|"", options: object|{precisePath:""})**
Sets a value by creating a txt file in the directory specified, and under the key given with contents of the value parsed
#### **options.precisePath**
Optional subfolder located in the this.path directory.
[default: ""] (if not specified, just gets saved into the directory specified in the class constructor)

### **Method remove(key: string, options: object|{precisePath: ""})**
Removes a value from your filesystem database, deleting the txt file
#### **options.precisePath**
[default: ""]

### **Method entries(dir: string)**
Gets all the entries saved into said `<dir>` path. Returns a 2 dimensional array. Ignores subfolders in said directory.

#### **options.dir**
Directory of which to collate entries from.

Returns: 2 dimensional array `[ [ "key", "value" ], [ "key0", "value" ] ]`

**__Example__**
```js 
const fsdb = require("fs-db0");
const db = new fsdb("./db/");

//set function
db.set("balance", 123); //true

//get function
const data = db.get("balance", { dataType: "number" });
console.log(data, typeof data); //123 number

//remove function
db.remove("balance"); //true

//get function (if value does not exist)
console.log(db.get("balance")); //null

db.set("balance", 123);

//entries function
const entries = db.entries();
console.log(entries); //[ [ "balance", "123" ] ]
console.log(entries.map((f) => `${f[0]}=${f[1]}`)); //[ "balance=123" ]
```
