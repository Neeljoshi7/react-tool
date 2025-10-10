import { useState } from "react";

function ExpenceTracker() {
  interface Expense {
    id: number;
    title: string;
    descripton: string;
    amount: number;
    category: string;
  }

  interface Member {
    id: number;
    name: string | number | readonly string[];
  }

  interface GroupExpenseEntry {
    id: number;
    member: Member;
    description: string;
    amount: number | string;
  }

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [group, setGroup] = useState<Member[]>([]);
  const [memberName, setMemberName] = useState<
    string | number | readonly string[] | undefined
  >();
  const [isGroupCreated, setIsGroupCreated] = useState<boolean>(false);
  const [grpExpEntries, setGrpExpEntries] = useState<GroupExpenseEntry[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>();
  const [description, setDescription] = useState<string>();
  const [amount, setAmount] = useState<number>();

  const handleAddExpense = () => {
    const newExpense: Expense = {
      id: Date.now(),
      title: "ABCD 1334",
      descripton: "ABCD 1334 Description",
      amount: 10,
      category: "Exp",
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleAddGroupMember = () => {
    console.log("memberName", memberName);
    if (memberName) {
      const newMember: Member = {
        id: Date.now(),
        name: memberName,
      };
      setGroup([...group, newMember]);
      setMemberName("");
    } else {
      alert("Member Not added");
    }
  };

  const createGroup = () => {
    if (group.length > 1) {
      setIsGroupCreated(true);
    } else {
      alert("Please add member in group");
    }
  };

  return (
    <>
      <h1>Expence Tracker</h1>
      <button onClick={handleAddExpense}>Add Expense</button>
      <br />
      <br />
      <br />
      {expenses.map((expense) => (
        <div key={expense.id}>
          <h2>
            {expense.title} | {expense.descripton} | {expense.amount} |{" "}
            {expense.category}
          </h2>
        </div>
      ))}

      <input
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        type="text"
        className="border p-3 rounded"
        placeholder="Member Name"
        disabled={isGroupCreated}
      />
      <br />
      <br />

      <button
        className="p-2 bg-blue-300 rounded-2xl cursor-pointer"
        onClick={handleAddGroupMember}
        disabled={isGroupCreated}
      >
        Add Group Member
      </button>

      {group.map((member: Member) => (
        <div key={member.id}>
          <p>{member.name}</p>
        </div>
      ))}

      <br />
      <br />
      <br />

      <button
        className="p-2 bg-blue-300 rounded-2xl cursor-pointer"
        onClick={createGroup}
      >
        Create Group
      </button>

      {/* Group Expense */}
      {isGroupCreated && (
        <div className="p-4 m-4 bg-gray-200 rounded w-1/2">
          <h2>Group Expense</h2>
          <div className="flex">
            <div className="w-1/2">
              <select
                onChange={(e) => setSelectedMember(e.target.value)}
                value={selectedMember}
                className="border p-2 rounded"
                name="group-members"
                id="grp"
              >
                {group.map((member: Member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
              <br />
              <br />
              <input
                type="text"
                name="description"
                className="border p-2 rounded"
                placeholder="Description"
              />
              <br />
              <br />
              <input
                type="number"
                name="amount"
                className="border p-2 rounded"
                placeholder="Amount"
              />
              <br />
              <br />
              <button className="p-2 bg-blue-300 rounded-2xl cursor-pointer">
                Add Expense
              </button>

              <br />
              <br />
              <br />
            </div>
            <div className="w-1/2"></div>
          </div>

          <h2 className="text-2xl font-bold">Total Group Expenses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {group.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Desc 1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹0.00
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ₹0.00
          </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpenceTracker;
