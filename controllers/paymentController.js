const Order = require('../models/Order');
const Product = require('../models/Product'); // Assuming Product model might be needed for receipt details
const User = require('../models/User'); // Assuming User model might be needed for receipt details
const PDFDocument = require('pdfkit');
const moment = require('moment'); // For date formatting

// Helper function to populate product details for order items
const populateOrderItems = async (orderItems) => {
  return Promise.all(orderItems.map(async item => {
    const product = await Product.findById(item.product);
    return {
      ...item.toObject(),
      product: product ? { name: product.name, price: product.price } : null, // Only fetch necessary product details
    };
  }));
};

// @desc    Create a new order (placeholder)
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // Placeholder logic for creating an order
    // In a real application, this would interact with a payment gateway
    // and create an order record in the database.
    console.log('Creating order with data:', req.body);
    res.status(200).json({ message: 'Order creation initiated (placeholder)', orderId: 'mockOrderId_123' });
  } catch (error) {
    console.error('Error initiating order:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Verify payment (placeholder)
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    // Placeholder logic for verifying payment
    // In a real application, this would verify the payment status with the payment gateway.
    console.log('Verifying payment with data:', req.body);
    res.status(200).json({ message: 'Payment verified (placeholder)', success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get payment status (placeholder)
// @route   GET /api/payments/status/:orderId
// @access  Private
exports.getPaymentStatus = async (req, res) => {
  try {
    // Placeholder logic for getting payment status
    // In a real application, this would query the payment gateway or database for the order status.
    console.log(`Getting status for order ID: ${req.params.orderId}`);
    res.status(200).json({ message: 'Payment status (placeholder)', orderId: req.params.orderId, status: 'Pending' });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user's transactions
// @route   GET /api/payments/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from auth middleware

    const { filterType, sortBy, selectedDate } = req.query;

    let query = { user: userId };

    if (filterType && filterType !== 'All') {
      // Assuming 'Online', 'COD', 'Refund' map to paymentMethod or status
      if (filterType === 'Online') {
        query.paymentMethod = { $ne: 'Cash on Delivery' };
        query.paymentStatus = 'Paid';
      } else if (filterType === 'COD') {
        query.paymentMethod = 'Cash on Delivery';
      } else if (filterType === 'Refund') {
        query.status = 'Cancelled'; // Assuming cancelled orders are refunded
      }
    }

    if (selectedDate) {
      const startOfDay = moment(selectedDate).startOf('day').toDate();
      const endOfDay = moment(selectedDate).endOf('day').toDate();
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'dateAsc':
        sortOptions.createdAt = 1;
        break;
      case 'dateDesc':
        sortOptions.createdAt = -1;
        break;
      case 'amountAsc':
        sortOptions.totalAmount = 1;
        break;
      case 'amountDesc':
        sortOptions.totalAmount = -1;
        break;
      default:
        sortOptions.createdAt = -1; // Default to newest first
        break;
    }

    const transactions = await Order.find(query)
      .sort(sortOptions)
      .populate('items.product', 'name price') // Populate product details
      .populate('address'); // Populate address for more details if needed

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Download transaction receipt
// @route   GET /api/payments/transactions/:id/receipt
// @access  Private
exports.getReceipt = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not authorized' });
    }

    const doc = new PDFDocument({ margin: 50 });
    let filename = `receipt_${orderId}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');

    doc.pipe(res);

    doc.fontSize(25).text('Myntra E-Receipt', { align: 'center' });
    doc.fontSize(10).text(`Date: ${moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}`, { align: 'right' });
    doc.moveDown();

    doc.fontSize(15).text(`Order ID: ${order._id}`);
    doc.text(`Customer Name: ${order.user.name}`);
    doc.text(`Customer Email: ${order.user.email}`);
    doc.text(`Shipping Address: ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipCode}`);
    doc.moveDown();

    doc.fontSize(13).text('Order Summary:');
    doc.moveDown(0.5);

    order.items.forEach(item => {
        doc.text(`  - ${item.product.name} (Size: ${item.size || 'N/A'}) x ${item.quantity} = ₹${item.price.toFixed(2)}`);
    });
    doc.moveDown();

    doc.text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, { align: 'right' });
    doc.text(`Payment Method: ${order.paymentMethod}`, { align: 'right' });
    doc.text(`Payment Status: ${order.paymentStatus}`, { align: 'right' });
    doc.moveDown();

    doc.fontSize(10).text('Thank you for shopping with Myntra!', { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Export user's transaction history
// @route   GET /api/payments/transactions/export
// @access  Private
exports.exportTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { format } = req.query; // 'pdf' or 'csv'

    let query = { user: userId }; // Same query as getTransactions for filtering, but without sort for export

    // Apply filtering if needed, e.g., for a specific date range or type
    // This part should mirror the filtering logic in getTransactions if desired for exports
    // For simplicity, let's export all for now.
    const transactions = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('items.product', 'name') // Only product name for export
      .lean(); // Use .lean() for faster query when not saving/updating

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for export.' });
    }

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');

      const csvRows = [];
      const headers = ['Order ID', 'Date', 'Amount', 'Payment Method', 'Payment Status', 'Items', 'Status'];
      csvRows.push(headers.join(','));

      transactions.forEach(transaction => {
        const itemsList = transaction.items.map(item => item.product ? `${item.product.name} (x${item.quantity})` : `Unknown Product (x${item.quantity})`).join('; ');
        csvRows.push([
          transaction._id,
          moment(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          transaction.totalAmount.toFixed(2),
          transaction.paymentMethod,
          transaction.paymentStatus,
          `"${itemsList}"`, // Quote items list to handle commas within
          transaction.status,
        ].join(','));
      });

      return res.status(200).send(csvRows.join('\n'));

    } else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30 });
      let filename = `transactions_history.pdf`;
      filename = encodeURIComponent(filename);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');

      doc.pipe(res);

      doc.fontSize(20).text('Myntra Transaction History', { align: 'center' });
      doc.moveDown();

      transactions.forEach(transaction => {
        doc.fontSize(14).text(`Order ID: ${transaction._id}`);
        doc.fontSize(12).text(`Date: ${moment(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}`);
        doc.text(`Amount: ₹${transaction.totalAmount.toFixed(2)}`);
        doc.text(`Payment: ${transaction.paymentMethod} - ${transaction.paymentStatus}`);
        doc.text(`Status: ${transaction.status}`);
        const itemsList = transaction.items.map(item => item.product ? `${item.product.name} (x${item.quantity})` : `Unknown Product (x${item.quantity})`).join(', ');
        doc.text(`Items: ${itemsList}`);
        doc.moveDown();
      });

      doc.end();

    } else {
      return res.status(400).json({ message: 'Invalid export format. Choose pdf or csv.' });
    }

  } catch (error) {
    console.error('Error exporting transactions:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};