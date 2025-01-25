import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function TableRooms() {
  function createData(habitacion: number, consumo: number, presencia: boolean) {
    return { habitacion, consumo, presencia };
  }

  const rows = [
    createData(101, 0.0, false),
    createData(102, 15.5, true),
    createData(103, 9.3, true),
    createData(104, 20.8, false),
    createData(105, 7.2, true),
    createData(106, 0.0, false),
    createData(201, 0.0, false),
    createData(202, 15.5, true),
    createData(203, 9.3, true),
    createData(204, 20.8, false),
    createData(205, 7.2, true),
    createData(206, 0.0, false),
    createData(301, 0.0, false),
    createData(302, 15.5, true),
    createData(303, 9.3, true),
    createData(304, 20.8, false),
    createData(305, 7.2, true),
    createData(306, 0.0, false),
  ];
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 605,
        overflow: "auto",
        backgroundColor: "hsl(222, 34%, 21%)",
        "&::-webkit-scrollbar": {
          width: "8px", 
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "hsl(219, 22%, 28%)", 
          borderRadius: "4px", 
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "hsl(215, 12%, 43%)", 
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "hsl(222, 34%, 21%)",
        },
      }}
    >
      <Table sx={{
          minWidth: 350,
          "@media (max-width: 700px)": {
            minWidth: 100, 
          },
          
        }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                color: "white",
                fontWeight: "bold",
                borderColor:"black",
              }}
            >
              Habitación
            </TableCell>
            <TableCell
              align="center"
              sx={{
                color: "white",
                fontWeight: "bold",
                borderColor:"black",
              }}
            >
              Consumo (kWh)
            </TableCell>
            <TableCell
              align="center"
              sx={{
                color: "white",
                fontWeight: "bold",
                borderColor:"black",
              }}
            >
              Presencia
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.habitacion}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } , backgroundColor: row.presencia ? "#16223b" : "transparent", }}
            >
              <TableCell
                component="th"
                scope="row"
                align="center"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  borderColor:"black",
                  
                  
                }}
              >
                {row.habitacion}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "hsl(154, 47%, 52%)",
                  fontWeight: "bold",
                  borderColor:"black",
                  
                }}
              >
                {row.consumo.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: row.presencia ? "red" : "white",
                  fontWeight: "bold",
                  borderColor:"black",
                  
                  
                }}
              >
                {row.presencia ? "Ocupada" : "Desocupada"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
