So, I've always been a fan of big data. I do it as my full time job. And trust me, it costs a lot of money to move data around. The more data you have, the more it costs.

When comparing encoding techniques, there may only be a few kilobytes of difference between the two. But if you have billions of encoded readings, even a fraction of a fraction of bytes saved can save thousands of dollars.

[Serialization Methods Github Source Code](https://github.com/jackmead515/serializations)

```bash
20,000 strings at 20 characters
20,000 numbers at 32 bits

==| CSV |==
Data Size: 1024302 bytes
Base64 Size: 1365736 bytes
Encode Time: 4.538122835 ms
Parse Time: 9.893573074999999 ms

==| JSON |==
Data Size: 1268814 bytes
Base64 Size: 1691752 bytes
Encode Time: 8.921927827 ms
Parse Time: 8.213622645 ms

==| ProtoBuf |==
Data Size: 936944 bytes
Base64 Size: 1249260 bytes
Encode Time: 5.467107863 ms
Parse Time: 1.2513737409999999 ms

==| Avro |==
Data Size: 847351 bytes
Base64 Size: 1129804 bytes
Encode Time: 4.372638659 ms
Parse Time: 2.6514886630000003 ms
```

So what kind of techniques are out there? What do the professionals recommend? For starters, there is the famous JSON

## JSON

JSON is really cool because it's extremely human readable. Many configuration files, embedded data, and records are stored in this format. In fact, this blog your reading is actually written and stored as JSON in my github repo. Since I have a disk quota, at the time of writing this, at 100GB (hard limit) I don't have anything to worry about and could stored hundreds of blog posts on there.

But, JSON is the most expensive, in terms of size, in my list. In the link above, I stored 20,000 strings of 20 characters long, and 20,000 integers (32 bits) in a simple JSON schema. This resulted in 1269 KB of data. Not bad! But we can do much better.

## CSV

CSV is another very popular human readable encoding format. It is the prefered format for spreadsheets, tables, and even AI datasets as it can easily store row x column based data.

And it's fast! Using the same strings and numbers as above, The encoding time was HALF of JSON's encoding time. Woah! Additionally, it's also lighter of on the disk space coming in at around 1024 KB. But is there anything better? Oh heck yeah...

## Protobuf

This is an insanely cool format released by the Google team. But, it's a little different then your traditional formats like JSON, CSV, or XML. The main difference is that your data is stored seperately from it's own schema. Your schema is actually stored as a seperate 'proto' file. An example is seen below.

```rust
message Wrapper {
  repeated string name = 1;
  repeated int32 number = 2;
}
```

Obviously the schema can get much more complicated, but, you write your schema in this sudo language and then encode the data with it. In my example, I stored the strings and numbers with this schema which resulted in only 936.9KB. Funny thing is that it was actually slower at encoding the data then CSV, but faster at parsing it then any other format listed here! The average parse time was just 1.2 miliseconds!! Blazing fast!

Is there something better than this? It would be hard to imagine, but, there certainly is. Unfortunately, it's an Apache creation. Yuck...

## Avro

Taking the same concept as Protobuf, Avro has a schema file written in JSON and then encodes the data with that. Admittedly, it beats all other encoding methods at everything (only losing to Protobuf in parsing time just slightly).

```javascript
{
	"namespace": "",
	"name": "AvroSample",
	"type": "record",
	"fields": [
		{
			"name": "name",
			"type": {
				"name": "nameType",
				"type": "array",
				"items": "string"
			}
		},
		{
			"name": "number",
			"type": {
				"name": "numberType",
				"type": "array",
				"items": "int"
			}
		}
	]
}
```

This schema takes those strings and numbers and turns it into just 847 KB in 4.3 milliseconds. And it hasn't even been compressed yet!

## Overview

When I chose to use JSON for my blogs, I did it knowing that it was slow and heavy on disk. But I didn't mind because in the end it's still fast enough to make my blog load really fast. Would it be cool to use something even faster and more compact? Sure of course! But it's not super necessary. However, I also make this educated choices whenever I make a new product. And now, with these comparisons, you can too.

Giving tutorials over Protobuf and Avro would be way to boring and take a long time to make complete. Besides, there is already great documentation in addition to the source code I built in Java. So instead, I suggest reading these links below. These are all tools and tutorials I have used to learn the schema and how to start building your own big data applications!

| Protobuf | Avro |
| --- | --- |
| [Documentation on V3 Schema](https://developers.google.com/protocol-buffers/docs/proto3) | [Schema Specification](https://avro.apache.org/docs/1.7.6/spec.html) |
| [Node.js NPM: protobufjs](https://www.npmjs.com/package/protobufjs) | [Node.js NPM: avsc](https://www.npmjs.com/package/avsc) |
| [Java Maven: com.google.protobuf](https://mvnrepository.com/artifact/com.google.protobuf/protobuf-java) | [Java Maven: org.apache.avro](https://mvnrepository.com/artifact/org.apache.avro/avro) |
| [Rust Crates: protobuf](https://crates.io/crates/protobuf) | [Rust Crates: avro-rs](https://crates.io/crates/avro-rs) |

If you enjoyed this content, let me know in the comments below. If you'd like to see more or learn more, don't be afraid to ask!