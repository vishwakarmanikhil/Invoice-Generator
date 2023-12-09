import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const PageNotFound = lazy(() => import('../PageNotFound'));
const CreateInvoice = lazy(() => import('../CreateInvoice'));
const ViewInvoice = lazy(() => import('../ViewInvoice'));

const fallBack = (<div className="page-loader__container"><span className="plc__animation"></span></div>);

const AppRouter = () => {
  return (
    <Router>
        <Suspense fallback={fallBack}>
            <Routes>
                <Route path="/" element={<CreateInvoice />} />
                <Route path="/invoice" element={<ViewInvoice />} />
                <Route path="/invoice/:invoiceID" element={<ViewInvoice />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    </Router>
  );
};

export default AppRouter;
