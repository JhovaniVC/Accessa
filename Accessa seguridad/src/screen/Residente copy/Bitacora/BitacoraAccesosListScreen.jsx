import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { Colors } from '../../../themes/colors';
import { UserContext } from '../../../context/UserContext';
import { buildApiUrl } from '../../../config/api';

export default function BitacoraAccesosListScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Cargar registros de accesos
  const loadAccessLogs = async (page = 1, refresh = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (statusFilter !== 'todos') {
        params.append('status', statusFilter);
      }

      const response = await fetch(buildApiUrl(`/api/access-logs?${params}`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        if (refresh || page === 1) {
          setAccessLogs(data.accessLogs);
        } else {
          setAccessLogs(prev => [...prev, ...data.accessLogs]);
        }
        
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los registros');
      }
    } catch (error) {
      console.error('Error loading access logs:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAccessLogs(1, true);
  }, [statusFilter]);

  // Función de refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadAccessLogs(1, true);
  };

  // Cargar más registros
  const loadMore = () => {
    if (hasMore && !loading) {
      loadAccessLogs(currentPage + 1);
    }
  };

  // Filtrar registros por término de búsqueda
  const filteredLogs = accessLogs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.deliveredBy?.toLowerCase().includes(searchLower) ||
      log.receivedBy?.toLowerCase().includes(searchLower) ||
      log.department?.toLowerCase().includes(searchLower) ||
      log.courierCompany?.toLowerCase().includes(searchLower)
    );
  });

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'entregado':
        return '#10B981';
      case 'pendiente':
        return '#F59E0B';
      case 'rechazado':
        return '#EF4444';
      default:
        return Colors.textSecondary;
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar un registro
  const renderAccessLog = (log) => (
    <Card key={log._id} style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.department}>{log.department}</Text>
            <Text style={styles.date}>{formatDate(log.accessDate)}</Text>
          </View>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(log.status) }}
            style={[styles.statusChip, { borderColor: getStatusColor(log.status) }]}
          >
            {log.status}
          </Chip>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Entregado por:</Text>
          <Text style={styles.value}>{log.deliveredBy}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Paquetería:</Text>
          <Text style={styles.value}>{log.courierCompany}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Recibido por:</Text>
          <Text style={styles.value}>{log.receivedBy}</Text>
        </View>

        {log.description && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.value}>{log.description}</Text>
          </View>
        )}

        {log.comments && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Comentarios:</Text>
            <Text style={styles.value}>{log.comments}</Text>
          </View>
        )}

        <View style={styles.registeredBy}>
          <Text style={styles.registeredByText}>
            Registrado por: {log.registeredBy?.name || 'N/A'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading && accessLogs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando registros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por departamento, entregador, receptor..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === 'todos' && styles.filterChipActive]}
            onPress={() => setStatusFilter('todos')}
          >
            <Text style={[styles.filterChipText, statusFilter === 'todos' && styles.filterChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === 'entregado' && styles.filterChipActive]}
            onPress={() => setStatusFilter('entregado')}
          >
            <Text style={[styles.filterChipText, statusFilter === 'entregado' && styles.filterChipTextActive]}>
              Entregados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === 'pendiente' && styles.filterChipActive]}
            onPress={() => setStatusFilter('pendiente')}
          >
            <Text style={[styles.filterChipText, statusFilter === 'pendiente' && styles.filterChipTextActive]}>
              Pendientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === 'rechazado' && styles.filterChipActive]}
            onPress={() => setStatusFilter('rechazado')}
          >
            <Text style={[styles.filterChipText, statusFilter === 'rechazado' && styles.filterChipTextActive]}>
              Rechazados
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de registros */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          
          if (isCloseToBottom && hasMore && !loading) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchTerm ? 'No se encontraron registros con esa búsqueda' : 'No hay registros de accesos'}
            </Text>
          </View>
        ) : (
          filteredLogs.map(renderAccessLog)
        )}

        {loading && accessLogs.length > 0 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingMoreText}>Cargando más registros...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filters: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterChip: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.textOnPrimary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  department: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusChip: {
    height: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 100,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  registeredBy: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  registeredByText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 10,
    color: Colors.textSecondary,
    fontSize: 14,
  },
}); 