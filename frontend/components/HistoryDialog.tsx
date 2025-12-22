import React, { useMemo } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Button, 
    DialogActions, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Box,
    Typography
} from '@mui/material';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { tomorrow } from "../app/fonts"; 

// The component props
interface HistoryDialogProps {
    open: boolean;
    onClose: () => void;
    data: any[];
    symbol: string;
}

export default function HistoryDialog({ open, onClose, data, symbol }: HistoryDialogProps) {
    
    const formattedData = useMemo(() => {
        if (!Array.isArray(data)) return [];

        return data.map((item) => {
            if (Array.isArray(item)) {
                return {
                    timestamp: item[0],
                    close: item[1]
                };
            }
            return item;
        });
    }, [data]);

    const formatXAxis = (tickItem: string | Date) => {
        if (!tickItem) return "";
        const date = new Date(tickItem);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: '2-digit' 
        });
    };

    const formatFullDate = (label: string | Date) => {
        if (!label) return "";
        const date = new Date(label);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{ 
                sx: { 
                    bgcolor: "#1F2430", 
                    color: "#8FCAFA",
                    border: "1px solid #2798F5"
                } 
            }}
        >
            <DialogTitle sx={{ fontFamily: tomorrow.style.fontFamily, color: "#2798F5", fontSize: "1.5rem" }}>
                {symbol} Performance
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ height: 350, width: "100%", mb: 4, mt: 2 }}>
                    {formattedData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    tickFormatter={formatXAxis} 
                                    stroke="#8FCAFA" 
                                    fontSize={12}
                                    tick={{ fill: '#8FCAFA' }}
                                    minTickGap={50}
                                />
                                <YAxis 
                                    stroke="#8FCAFA" 
                                    domain={['auto', 'auto']} 
                                    tick={{ fill: '#8FCAFA' }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0F1623', border: '1px solid #2798F5' }}
                                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#8FCAFA' }}
                                    labelFormatter={formatFullDate}
                                    formatter={(value: number) => [`$${value}`, "Close Price"]}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="close" 
                                    stroke="#2798F5" 
                                    strokeWidth={2} 
                                    dot={false} 
                                    activeDot={{ r: 6, fill: "white" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Typography sx={{ fontFamily: tomorrow.style.fontFamily }}>Loading Chart Data...</Typography>
                        </Box>
                    )}
                </Box>
                <Typography variant="h6" sx={{ fontFamily: tomorrow.style.fontFamily, color: "#2798F5", mb: 1 }}>
                    Historical Data
                </Typography>
                
                <Box sx={{ maxHeight: 250, overflow: "auto", border: "1px solid #2798F5", borderRadius: 1 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: "#2798F5", color: "white", fontFamily: tomorrow.style.fontFamily, width: "50%" }}>Date</TableCell>
                                <TableCell sx={{ bgcolor: "#2798F5", color: "white", fontFamily: tomorrow.style.fontFamily, width: "50%" }}>Close Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Use formattedData here, reversed */}
                            {[...formattedData].reverse().map((row, i) => (
                                <TableRow key={i} hover sx={{ '&:hover': { bgcolor: '#2a3b55' } }}>
                                    <TableCell sx={{ color: "#8FCAFA", fontFamily: tomorrow.style.fontFamily }}>
                                        {formatFullDate(row.timestamp)}
                                    </TableCell>
                                    <TableCell sx={{ color: "#2798F5", fontWeight: "bold", fontFamily: tomorrow.style.fontFamily }}>
                                        ${row.close}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
                    sx={{ 
                        bgcolor: "#2798F5", 
                        color: "white", 
                        fontFamily: tomorrow.style.fontFamily,
                        '&:hover': { bgcolor: "#1e7bca" }
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}