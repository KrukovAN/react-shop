export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const getFakeApi = async (): Promise<void> => {
  const result: Todo = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1",
  ).then((response) => response.json() as Promise<Todo>);
  console.log(result);
};

export class SomeClass {
  set: Set<number>;
  channel: BroadcastChannel;

  constructor() {
    this.set = new Set([1]);
    this.channel = new BroadcastChannel("test-broadcast-channel");
  }
}

export type Data =
  | {
      type: "Money";
      value: Money;
    }
  | {
      type: "Percent";
      value: Percent;
    };

export type Money = {
  currency: string;
  amount: number;
};

export type Percent = {
  percent: number;
};

// const getDataAmount = (data: Data): number => {
//   switch (data.type) {
//     case 'Money':
//       return data.value.amount;

//     case 'Percent':
//       return data.value.percent;

//     default: {
//       const unhandled: never = data;
//       throw new Error(`unknown type: ${unhandled}`);
//     }
//   }
// };
