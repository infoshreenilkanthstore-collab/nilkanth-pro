const fs = require('fs');

let code = fs.readFileSync('src/components/checkout/CheckoutPage.jsx', 'utf8');

const isCRLF = code.includes('\r\n');
const normalizedCode = code.replace(/\r\n/g, '\n');

const blockToRemove = `  // Customer First Order Status (Free Shipping on >= 599)
  const [firstOrderData, setFirstOrderData] = useState(null);
  const [isCheckingFirstOrder, setIsCheckingFirstOrder] = useState(false);

  useEffect(() => {
    const cleanPhone = String(customer.phone || "").replace(/\\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setFirstOrderData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingFirstOrder(true);
      try {
        const res = await fetchFirstOrderStatus({
          phone: cleanPhone,
          order_amount: subtotal,
        });
        if (res.success) {
          setFirstOrderData(res);
        } else {
          setFirstOrderData(null);
        }
      } catch (err) {
        console.error("Failed checking customer first order status:", err);
        setFirstOrderData(null);
      } finally {
        setIsCheckingFirstOrder(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [customer.phone, subtotal]);

  const isFirstOrderFreeEligible = useMemo(() => {
    return Boolean(
      firstOrderData?.is_first_order === true &&
      (subtotal >= (firstOrderData?.free_shipping?.min_order_amount || 599) ||
        firstOrderData?.free_shipping?.eligible === true)
    );
  }, [firstOrderData, subtotal]);\n\n`;

if (!normalizedCode.includes(blockToRemove)) {
  console.error("blockToRemove not found!");
  process.exit(1);
}

// 1. Remove from top
let updated = normalizedCode.replace(blockToRemove, '');

// 2. Insert after subtotal declaration
const subtotalDecl = `  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 1), 0);
  }, [cartItems]);`;

const insertion = `${subtotalDecl}

  // -------------------------------------------------------------
  // Customer First Order Status (Free Shipping on >= 599)
  // -------------------------------------------------------------
  const [firstOrderData, setFirstOrderData] = useState(null);
  const [isCheckingFirstOrder, setIsCheckingFirstOrder] = useState(false);

  useEffect(() => {
    const cleanPhone = String(customer.phone || "").replace(/\\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setFirstOrderData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingFirstOrder(true);
      try {
        const res = await fetchFirstOrderStatus({
          phone: cleanPhone,
          order_amount: subtotal,
        });
        if (res.success) {
          setFirstOrderData(res);
        } else {
          setFirstOrderData(null);
        }
      } catch (err) {
        console.error("Failed checking customer first order status:", err);
        setFirstOrderData(null);
      } finally {
        setIsCheckingFirstOrder(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [customer.phone, subtotal]);

  const isFirstOrderFreeEligible = useMemo(() => {
    return Boolean(
      firstOrderData?.is_first_order === true &&
      (subtotal >= (firstOrderData?.free_shipping?.min_order_amount || 599) ||
        firstOrderData?.free_shipping?.eligible === true)
    );
  }, [firstOrderData, subtotal]);`;

if (!updated.includes(subtotalDecl)) {
  console.error("subtotalDecl not found!");
  process.exit(1);
}

updated = updated.replace(subtotalDecl, insertion);

const finalCode = isCRLF ? updated.replace(/\n/g, '\r\n') : updated;
fs.writeFileSync('src/components/checkout/CheckoutPage.jsx', finalCode, 'utf8');
console.log('Successfully relocated firstOrderData after subtotal declaration in CheckoutPage.jsx');

