import React from "react";

type TItem = {
  item: any;
  id: string;
};

const Road = ({ item }: TItem) => {
  return <td className="table-data">{item}</td>;
};

export default Road;
