function getValue(obj, key) {
    if (!key) return "";
    if (!obj) return "";
    return key.split(".").reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : "";
    }, obj);
}

export default function Table({
    columns = [],
    data = [],
    actions,
    getRowClassName,
}) {
    return (
        <div className="rounded-2xl overflow-hidden text-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-175">
                    <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="text-left p-4 font-semibold text-slate-300 whitespace-nowrap"
                                >
                                    {col.title}
                                </th>
                            ))}

                            {actions && (
                                <th className="text-left p-4 font-semibold text-slate-300 whitespace-nowrap">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-transparent">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="p-10 text-center text-slate-400"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr
                                    key={row._id}
                                    className={`border-b border-white/5 transition ${getRowClassName
                                        ? getRowClassName(row)
                                        : ""
                                        }`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="p-4 whitespace-nowrap"
                                        >
                                            {col.render
                                                ? col.render(
                                                    getValue(row, col.key),
                                                    row,
                                                    idx
                                                )
                                                : getValue(row, col.key)}
                                        </td>
                                    ))}

                                    {actions && (
                                        <td className="p-4">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}