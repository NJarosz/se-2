// "use client";

// import { useEffect, useState } from "react";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// export const NodeDropdown = () => {
//     const [newLocation, setNewLocation] = useState<number | null>(null);
//     const [nodeLocations, setNodeLocations] = useState<{ id: number; name: string }[]>([]);


//     const { data: nodes } = useScaffoldReadContract({
//         contractName: "StateTransition",
//         functionName: "fetchNodes",
//     });

//     useEffect(() => {
//         const populateNodes = async () => {
//             if (nodes) {
//                 const nodeList = [];
//                 const len = nodes[0].length;
//                 for (let i = 0; i < len; i++) {
//                     // Simulate data fetching
//                     nodeList.push({ id: Number(nodes[0][i]), name: nodes[1][i].toString() });
//                 }
//                 console.log("node lists: ", nodeList);
//                 setNodeLocations(nodeList);
//             };
//         }
//         populateNodes();
//     }, [nodes]);

//     useEffect(() => {
//         console.log("NodeLocations: ", nodeLocations);
//     }, [nodeLocations]);

//     return (
//         <div>
//             {/* Location Input - dropdown */}
//             <div className="mb-4">
//                 <label htmlFor="location" className="block font-medium">
//                     View Location Codes:
//                 </label>
//                 <select
//                     id="location"
//                     className="border p-2 w-full"
//                     value={newLocation ?? ""}
//                     onChange={e => setNewLocation(parseInt(e.target.value))}
//                 >
//                     <option value="">Select Location</option>
//                     {nodeLocations.map(location => (
//                         <option key={location.id} value={location.id}>
//                             {location.id} - {location.name} {/* Display ID and name */}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </div>
//     );
// };

