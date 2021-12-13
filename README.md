# Attack tree project

Deployed version (https://attack-trees.vercel.app).

## Technology stack
- React (https://reactjs.org)
- Typescript (https://www.typescriptlang.org/)
- Tailwind (https://tailwindcss.com/)
- CSS 
- Cloud Database (https://fauna.com/)
- Cloudinary for file storage (https://cloudinary.com/)

## Architectural diagram
![Screenshot 2021-12-10 at 00 40 08](https://user-images.githubusercontent.com/23234383/145492717-03d4f5e2-8cfe-46e7-bb42-427629ecbc1b.png)

## Frontend
The frontend application is built using a `javascript` framework called `React.js` with a supporting library `React-Flow` to help drawing svg boxes to the HTML canvas.  

```javascript
         <ReactFlow
            elements={elements}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onNodeDragStop={handleNodeDragStop}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onLoad={onLoad}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={0.5}
            />
            <Controls />
         </ReactFlow>
```

## Faunadb
This is a cloud NoSQL database that stores data about attack trees including but not limited to `nodes`, `file-names`, `comments`. This cloud database provides an API/SDK to integrate seamlessly with the frontend applications. This is atypical to conventional development approach where there is a dedicated backend. 

![Screenshot 2021-12-13 at 02 23 44](https://user-images.githubusercontent.com/23234383/145739110-0cec8f34-d48d-4b2a-8731-ac2d4d0a2270.png)

## Cloudinary
This is the cloud file storage used in this application to store the files. While the `Faunadb` stores the `source_url` for the files itself. This also provides an easy to integrate API/SDK to integrate directly with the fronend application. 

```javascript
const uploadFile = async (
  treeId: string,
  nodeTitle: string,
  nodeId: string,
  filename: string,
  files: FileList
) => {
  const data = new FormData();
  data.append("file", files[0]);
  data.append("public_id", `${treeId}/${filename}`);
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET!);
  try {
    //upload to cloudinary
    const response = await (
      await fetch(process.env.REACT_APP_CLOUDINARY_URL!, {
        method: "POST",
        body: data,
      })
    ).json();

    //upload to database
    await db.client.query(
      db.q.Create(db.q.Collection(FILE_COLLECTION), {
        data: {
          name: filename,
          treeId,
          nodeTitle,
          nodeId,
          url: response.url,
          format: response.format,
        },
      })
    );
  } catch (err) {}
};
```



## Main Datastructures.
- Arrays
- Tree

## Algorithms. 
- Breadth first traversal:

The initial nodes rendering in the attack-tree workflow area was represented using an Array data structure. However, to calculate the cheapest path, that had to be copied into a Tree Data structure. The Breadth first traversal algorithm was useful in this regard. see below: 

```javascript 
  //breadth first traversal
  traverse = (cb: (node: TreeNode) => void) => {
    if (!this.root) return;
    const queue: TreeNode[] = [this.root];

    while (queue.length) {
      const next = queue.shift();
      cb(next!);

      queue.push(...next!.children);
    }
  };

```
- Depth first traversal:

In calculating the cheapest path itself, depth first algorithm was a better choice, because all nodes from the parent source node to the leaf nodes had to be traverse to get the true cheapest path. 

```javascript

  //depth first
  getCheapestPath = (): FullPath[""] | undefined => {
    if (!this.root) return;

    const validPath: FullPath = {};
    let counter = 0;
    const stack = [this.root];

    while (stack.length) {
      const next = stack.pop();
      if (next!.children.length) {
        stack.push(...next!.children);
      } else {
        //is a leaf node
        let weightSum = next!.data.data.nodeWeight;
        validPath[`${counter}`] = {
          path: [
            ...next!.getAncestors((weight) => (weightSum += weight ?? 0)),
            next!,
          ],
          weightSum,
        };

        ++counter;
      }
    }

    return Object.entries(validPath).reduce(
      (cheapestPath: FullPath[""], entry) => {
        const [, { path, weightSum }] = entry;
        if (weightSum < cheapestPath.weightSum) {
          cheapestPath.path = path;
          cheapestPath.weightSum = weightSum;
        }
        return cheapestPath;
      },
      {
        path: [],
        weightSum: Infinity,
      }
    );
  };
```

## How to run

```
git clone

cd attack-trees

yarn 

yarn start

```

head to your browser and type in `http://localhost:3000`

### Success case. 
you should see this. 

<img width="1438" alt="Screenshot 2021-11-17 at 22 51 38" src="https://user-images.githubusercontent.com/23234383/142288291-4d27a63a-e8fd-4989-868f-b64591de3372.png">


