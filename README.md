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

## Main Datastructures.
- Arrays
- Tree

## Algorithms. 
- Breadth first traversal
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
- Depth first traversal
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


