import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function SongBookTable({song_headers, rows}) {
  return (
    <TableContainer sx={{width: "auto"}} component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              song_headers.map((song_head) => (
                <TableCell align="left">{song_head}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.title + row.id.toString()}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell align="left">{row.title}</TableCell>
              <TableCell align="left">{row.artist}</TableCell>
              <TableCell align="left">{row.release_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}