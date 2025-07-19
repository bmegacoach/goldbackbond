import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Eye,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface Loan {
  loanId: number
  borrower: string
  collateralValueUSD: string
  loanAmountUSD: string
  currentLTVPercent: string
  interestRatePercent: string
  daysToMaturity: number
  nextPaymentAmountUSD: string
  nextPaymentDate: number
  status: string
}

const LoanManagerPage = () => {
  const [loans, setLoans] = useState<Loan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('loanId')
  const [currentPage, setCurrentPage] = useState(1)
  const [loansPerPage] = useState(10)

  // Mock lender ID for demo
  const lenderId = 1

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    filterAndSortLoans()
  }, [loans, searchTerm, statusFilter, sortBy])

  const fetchLoans = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/lenders/${lenderId}/loans?limit=20`)
      const data = await response.json()
      setLoans(data.data.loans || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching loans:', error)
      setIsLoading(false)
    }
  }

  const filterAndSortLoans = () => {
    let filtered = loans.filter(loan => {
      const matchesSearch = 
        loan.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanId.toString().includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort loans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'loanAmount':
          return parseFloat(b.loanAmountUSD.replace(/[$,]/g, '')) - parseFloat(a.loanAmountUSD.replace(/[$,]/g, ''))
        case 'ltv':
          return parseFloat(b.currentLTVPercent) - parseFloat(a.currentLTVPercent)
        case 'maturity':
          return a.daysToMaturity - b.daysToMaturity
        default:
          return b.loanId - a.loanId
      }
    })

    setFilteredLoans(filtered)
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
      case 'LIQUIDATION_RISK':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">At Risk</Badge>
      case 'OVERDUE':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Overdue</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  const getLTVColor = (ltvPercent: string) => {
    const ltv = parseFloat(ltvPercent)
    if (ltv <= 60) return 'text-green-400'
    if (ltv <= 75) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  // Pagination
  const indexOfLastLoan = currentPage * loansPerPage
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan)
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading loan portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Loan Portfolio Manager
              </h1>
              <p className="text-gray-300">
                Monitor and manage your institutional lending portfolio
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={fetchLoans}
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 hover:from-amber-400 hover:to-yellow-500">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/60 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Loans</p>
                  <p className="text-2xl font-bold text-white">{loans.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">At Risk</p>
                  <p className="text-2xl font-bold text-red-400">
                    {loans.filter(loan => loan.status === 'LIQUIDATION_RISK').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-white">
                    ${loans.reduce((sum, loan) => sum + parseFloat(loan.loanAmountUSD.replace(/[$,]/g, '')), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg LTV</p>
                  <p className="text-2xl font-bold text-white">
                    {loans.length > 0 
                      ? (loans.reduce((sum, loan) => sum + parseFloat(loan.currentLTVPercent), 0) / loans.length).toFixed(1)
                      : '0'
                    }%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-800/60 border-amber-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by ID or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Status Filter</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="LIQUIDATION_RISK">At Risk</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loanId">Loan ID</SelectItem>
                    <SelectItem value="loanAmount">Loan Amount</SelectItem>
                    <SelectItem value="ltv">LTV Ratio</SelectItem>
                    <SelectItem value="maturity">Days to Maturity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Actions</label>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setSortBy('loanId')
                  }}
                  variant="outline"
                  className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans Table */}
        <Card className="bg-slate-800/60 border-amber-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Loan Portfolio</CardTitle>
              <Badge className="bg-slate-700 text-gray-300">
                {filteredLoans.length} of {loans.length} loans
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Loan ID</TableHead>
                    <TableHead className="text-gray-300">Borrower</TableHead>
                    <TableHead className="text-gray-300">Loan Amount</TableHead>
                    <TableHead className="text-gray-300">Collateral</TableHead>
                    <TableHead className="text-gray-300">LTV</TableHead>
                    <TableHead className="text-gray-300">Interest</TableHead>
                    <TableHead className="text-gray-300">Maturity</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLoans.map((loan) => (
                    <TableRow key={loan.loanId} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell className="text-white font-medium">#{loan.loanId}</TableCell>
                      <TableCell>
                        <span className="text-gray-300 font-mono text-sm">
                          {formatAddress(loan.borrower)}
                        </span>
                      </TableCell>
                      <TableCell className="text-white font-semibold">
                        {loan.loanAmountUSD}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {loan.collateralValueUSD}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getLTVColor(loan.currentLTVPercent)}`}>
                          {loan.currentLTVPercent}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {loan.interestRatePercent}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-gray-300">{loan.daysToMaturity}d</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(loan.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem className="text-gray-300 hover:text-white">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white">
                              <Download className="h-4 w-4 mr-2" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstLoan + 1} to {Math.min(indexOfLastLoan, filteredLoans.length)} of {filteredLoans.length} loans
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="border-slate-600 text-gray-300"
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 
                        ? "bg-amber-500 text-slate-900" 
                        : "border-slate-600 text-gray-300"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    className="border-slate-600 text-gray-300"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoanManagerPage