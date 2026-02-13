const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Address = require('../models/Address');
const PDFDocument = require('pdfkit'); // Make sure to install: npm install pdfkit
const csv = require('csv-stringify'); // Make sure to install: npm install csv-stringify

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.placeOrder = async (req, res) => {
  const { items, totalAmount, address, paymentMethod, trackingNumber, estimatedDelivery, orderNotes, couponCode, discountAmount } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    // Basic validation
    if (!items || items.length === 0 || !totalAmount || !address || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide all required order details.' });
    }

    // You might want to validate product IDs and quantities against your Product model
    // and recalculate totalAmount on the server to prevent tampering.

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      address,
      paymentMethod,
      trackingNumber,
      estimatedDelivery,
      orderNotes,
      couponCode,
      discountAmount,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid', // Assuming online payments are 'Paid' immediately
    });

    const savedOrder = await newOrder.save();
    // Populate necessary fields for response
    await savedOrder.populate('user', 'name email');
    await savedOrder.populate('items.product', 'name price image');
    await savedOrder.populate('address');

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order.' });
  }
};

// @desc    Get all orders for the authenticated user (Transactions)
// @route   GET /api/orders/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { type, startDate, endDate, sortBy } = req.query;

  let query = { user: userId };

  // Filter by type
  if (type && ['Online', 'COD', 'Refund'].includes(type)) {
    // Map frontend 'type' to backend 'paymentMethod' or 'status'
    // This mapping might need refinement based on exact data structure
    if (type === 'Online') {
      query.paymentMethod = { $ne: 'Cash on Delivery' };
    } else if (type === 'COD') {
      query.paymentMethod = 'Cash on Delivery';
    } else if (type === 'Refund') {
      query.status = 'Cancelled'; // Or a specific 'Refunded' status
    }
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  let sortOptions = {};
  // Sort transactions
  if (sortBy) {
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
        sortOptions.createdAt = -1; // Default sort
        break;
    }
  } else {
    sortOptions.createdAt = -1; // Default to newest first
  }

  try {
    const orders = await Order.find(query)
      .sort(sortOptions)
      .populate('items.product', 'name price image')
      .populate('address'); // Populate product details and address

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions.' });
  }
};

// @desc    Get order by ID (for detail view)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate('items.product', 'name price image')
      .populate('address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error while fetching order.' });
  }
};

const { sendPushNotification } = require('../utils/notificationSender');

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (for admin/internal use)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id: orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    await order.save();
    
    // Send push notification to the user
    if (order.user) {
      const title = 'Order Status Updated';
      const body = `Your order #${order._id.toString().slice(-6)} is now ${status}.`;
      await sendPushNotification(order.user, title, body, { orderId: order._id });
    }

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating order status.' });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Implement cancellation logic (e.g., check status, refund, etc.)
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}.` });
    }

    order.status = 'Cancelled';
    order.paymentStatus = 'Refunded'; // Assuming cancellation implies refund for paid orders
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully.', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error while cancelling order.' });
  }
};

// @desc    Download receipt for a single order
// @route   GET /api/orders/:id/receipt
// @access  Private
exports.downloadReceipt = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.product', 'name price')
      .populate('address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission.' });
    }

    // --- PDF Generation Logic ---
    const doc = new PDFDocument({ margin: 50 });
    let filename = `receipt_${order.id}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(25).text('Myntra Order Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${order.createdAt.toLocaleString()}`);
    doc.text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    doc.fontSize(14).text('Items:');
    order.items.forEach(item => {
      doc.text(`- ${item.product.name} (x${item.quantity}) - ₹${item.price.toFixed(2)} each`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Shipping Address:');
    doc.text(`${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipCode}`);
    doc.end();

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ message: 'Server error while generating receipt.' });
  }
};

// @desc    Export all transactions for the authenticated user as CSV or PDF
// @route   GET /api/orders/transactions/export?format=csv/pdf
// @access  Private
exports.exportTransactions = async (req, res) => {
  const userId = req.user.id;
  const { format } = req.query; // 'csv' or 'pdf'

  if (!format || !['csv', 'pdf'].includes(format)) {
    return res.status(400).json({ message: 'Invalid export format. Must be "csv" or "pdf".' });
  }

  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name')
      .populate('address');

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No transactions found to export.' });
    }

    if (format === 'csv') {
      let filename = `transactions_${userId}.csv`;
      res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-type', 'text/csv');

      const columns = [
        { key: 'orderId', header: 'Order ID' },
        { key: 'date', header: 'Date' },
        { key: 'totalAmount', header: 'Amount' },
        { key: 'paymentMethod', header: 'Payment Mode' },
        { key: 'status', header: 'Status' },
        { key: 'items', header: 'Items' },
        { key: 'address', header: 'Shipping Address' },
      ];

      const data = orders.map(order => ({
        orderId: order._id.toString(),
        date: order.createdAt.toLocaleString(),
        totalAmount: order.totalAmount.toFixed(2),
        paymentMethod: order.paymentMethod,
        status: order.status,
        items: order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', '),
        address: `${order.address.street}, ${order.address.city}`,
      }));

      csv.stringify(data, { header: true, columns: columns }, (err, result) => {
        if (err) {
          console.error('CSV stringify error:', err);
          return res.status(500).json({ message: 'Error generating CSV.' });
        }
        res.status(200).send(result);
      });

    } else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30 });
      let filename = `transactions_${userId}.pdf`;
      res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-type', 'application/pdf');

      doc.pipe(res);

      doc.fontSize(20).text('Myntra Transaction History', { align: 'center' });
      doc.moveDown();

      orders.forEach(order => {
        doc.fontSize(14).text(`Order ID: ${order._id}`);
        doc.text(`Date: ${order.createdAt.toLocaleString()}`);
        doc.text(`Amount: ₹${order.totalAmount.toFixed(2)}`);
        doc.text(`Mode: ${order.paymentMethod}`);
        doc.text(`Status: ${order.status}`);
        doc.text('Items: ' + order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', '));
        doc.text(`Address: ${order.address.street}, ${order.address.city}`);
        doc.moveDown(0.5);
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(30, doc.y).lineTo(doc.page.width - 30, doc.y).stroke();
        doc.moveDown();
      });

      doc.end();
    }
  } catch (error) {
    console.error('Error exporting transactions:', error);
    res.status(500).json({ message: 'Server error while exporting transactions.' });
  }
};

// You might still have these placeholders if they are used elsewhere
// exports.getAllOrders = (req, res) => res.status(200).json({ message: 'Get All Orders route' });
// exports.cancelOrder = (req, res) => res.status(200).json({ message: 'Cancel Order route' });