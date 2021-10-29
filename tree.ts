export type Nodes<T extends Display> = Node<T>[];

export interface Display {
  display(maxWidth?: number): string;
}

export type Node<T extends Display> = {
  body: T;
  children: Node<T>[];
};

class File {
  name: string;
  icon?: string;

  constructor(name: string, icon?: string) {
    this.name = name;
    this.icon = icon;
  }

  display(maxWidth?: number) {
    return this.name;
  }
}

type FileNode = Node<File>;

function displayNode<T extends Display>(node: Node<T>) {
  node.body.display();
}

type TreeOption = {
  verticalRule: string; // │
  continuousRule: string; // ├──
  lastRule: string; // └──
};

class Tree<T extends Display> {
  option: TreeOption;
  root: Node<T>;

  constructor(option: TreeOption, root: Node<T>) {
    this.option = option;
    this.root = root;
  }

  display(maxWidth?: number): string {
    return this.draw(this.root, []);
  }

  draw(node: Node<T>, indentKindStack: ("last" | "continuous")[]): string {
    const v = [];

    let indent = "";
    for (const [idx, kind] of indentKindStack.entries()) {
      if (idx == indentKindStack.length - 1) {
        if (kind == "last") {
          indent += this.option.lastRule;
        } else {
          indent += this.option.continuousRule;
        }
      } else {
        if (kind == "last") {
          indent += "   ";
        } else {
          indent += this.option.verticalRule;
        }
      }
    }

    v.push(indent + node.body.display());
    for (const [idx, child] of node.children.entries()) {
      if (idx == node.children.length - 1) {
        // 最後の罫線を用いる
        const stack = [...indentKindStack, "last"] as ("last" | "continuous")[];
        v.push(this.draw(child, stack));
      } else {
        const stack = [
          ...indentKindStack,
          "continuous",
        ] as ("last" | "continuous")[];
        v.push(this.draw(child, stack));
      }
    }
    return v.join("\n");
  }
}

const option = {
  verticalRule: "│  ",
  continuousRule: "├──",
  lastRule: "└──",
};

const root: FileNode = {
  body: new File("foo"),
  children: [
    { body: new File("bar1.ts"), children: [] },
    {
      body: new File("bar2.ts"),
      children: [
        {
          body: new File("baz1.ts"),
          children: [
            { body: new File("foo1.ts"), children: [] },
          ],
        },
        {
          body: new File("baz2.ts"),
          children: [
            { body: new File("foo1.ts"), children: [] },
            { body: new File("foo2.ts"), children: [] },
          ],
        },
      ],
    },
    { body: new File("bar3.ts"), children: [] },
    { body: new File("bar4.ts"), children: [] },
  ],
};

const tree = new Tree(option, root);

console.log(tree.display());
