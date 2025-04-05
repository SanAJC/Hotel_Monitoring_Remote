import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useRooms from "@/hooks/useRooms";

export default function TableRooms() {

  const { rooms } = useRooms();

  const rows = rooms.map((room) => ({
    habitacion: room.numero,
    consumo: room.consumo,
    presencia: room.presencia_humana,
  }));

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
        borderRadius: "10px",
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
                  color: row.presencia ? "red" : "#4BBE8C",
                  fontWeight: "bold",
                  borderColor:"black",
                  fontSize: "12px",
                  
                }}
              >
                <div
                  style={{
                    borderRadius: '20px',
                    border: `2px solid ${row.presencia ? 'red' : 'green'}`,
                    backgroundColor: row.presencia ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
                    padding: '4px',
                    display: 'inline-block'
                  }}
                >
                  {row.presencia ? "Ocupada" : "Desocupada"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
