import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import {
  Container, Typography, Paper, Box, Table, TableCell,
  TableContainer, TableBody, TableHead, TableRow, Button, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

function App() {

  const [products, setProducts] = useState([]);
  const [sku, setSku] = useState("")
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [popup, setPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token') || "");

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.data);

    } catch (error) {
      console.error(error);
    }
  }

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token);
    }
    catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  }

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);


  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/products', {
        name,
        sku,
        price: Number(price),
        stock: Number(stock)
      });
      getAuthConfig();
      setName("");
      setSku("");
      setPrice("");
      setStock("");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "failed to add");
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`);
      setPopup(false);
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  }

  if (!token) {
    return (
      <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Admin Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h4' fontWeight='bold' gutterBottom>Inventory Management</Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Box component='form' onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label='Product Name'
            size='small'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ flex: 2 }}
          />
          <TextField
            label='sku'
            size='small'
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            sx={{ flex: 2 }}
          />
          <TextField
            label='Price ($)'
            size='small'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            sx={{ flex: 2 }}
          />
          <TextField
            label='Stock'
            size='small'
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            sx={{ flex: 2 }}
          />

          <Button type='submit' variant='contained'> Add Product </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>sku</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='right'>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <Chip label={item.stock < 5 ? 'LowStock' : 'InStock'} color={item.stock < 5 ? 'error' : 'success'} />
                </TableCell>
                <TableCell align='right'>
                  <Button
                    variant='outlined'
                    color='error'
                    size='small'
                    onClick={() => {
                      setDeleteId(item._id);
                      setPopup(true);
                    }}
                  >
                    Delete
                  </Button>

                  {popup && (
                    <Dialog open={popup} onClose={() => setPopup(false)}>
                      <DialogTitle>Delete Product</DialogTitle>
                      <DialogContent>
                        <DialogContentText>Are you sure you want to delete?</DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setPopup(false)}>No</Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}

                </TableCell>

              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

    </Container>


  )
}

export default App
