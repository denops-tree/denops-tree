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
};

class Tree<T extends Display> {
  option: TreeOption;
  root: Node<T>;

  constructor(option: TreeOption, root: Node<T>) {
    this.option = option;
    this.root = root;
  }

  display(maxWidth?: number): string {
    return this.draw(this.root, 0);
  }

  draw(node: Node<T>, indent: number): string {
    const v = [];

    if (indent == 0) {
      v.push(node.body.display());
    } else {
      const strIndent = this.option.verticalRule.repeat(indent - 1) +
        this.option.continuousRule;
      v.push(strIndent + node.body.display());
    }

    for (const child of node.children) {
      v.push(this.draw(child, indent + 1));
    }
    return v.join("\n");
  }
}

const option = {
  verticalRule: "| ",
  continuousRule: "+ ",
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
